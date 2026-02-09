import {
  API_URL,
  COOKIE_PREFIX,
  CSRF_TOKEN_COOKIE_NAME,
  JWT_COOKIE_NAME,
  updateApiUrl,
  updatePanoWebsiteUrl
} from "$lib/variables.js";
import { getCredentialsServerSide } from "$lib/services/auth.js";

function stripModulePreload(linkHeader) {
  const parts = linkHeader
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  const kept = parts.filter((p) => !/;\s*rel="?modulepreload"?/i.test(p));

  return kept.length ? kept.join(", ") : null;
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({
  event,
  event: {
    cookies,
    url: { pathname },
  },
  resolve,
}) {
  const locals = {};

  // noinspection JSUnresolvedReference
  const apiUrlEnv = process.env.API_URL;

  // noinspection JSUnresolvedReference
  const panoWebsiteUrlEnv = process.env.PANO_WEBSITE_URL;

  if (apiUrlEnv) {
    updateApiUrl(apiUrlEnv);
    locals.apiUrlEnv = apiUrlEnv;
  }

  if (panoWebsiteUrlEnv) {
    updatePanoWebsiteUrl(panoWebsiteUrlEnv);
    locals.panoWebsiteUrlEnv = panoWebsiteUrlEnv;
  }

  const jwt = cookies.get(COOKIE_PREFIX + JWT_COOKIE_NAME);
  const csrfToken = cookies.get(COOKIE_PREFIX + CSRF_TOKEN_COOKIE_NAME);

  locals.user =
    jwt && csrfToken &&
    !pathname.startsWith("/api/") &&
    !pathname.startsWith("/auth/") &&
    (await getCredentialsServerSide(jwt));

  locals.csrfToken = csrfToken;

  event.locals = locals;

  const response = await resolve(event, {
    transformPageChunk: ({ html }) => {
      const isDev = process.env.NODE_ENV === "development";
      const importMap = `
  <script type="importmap" crossorigin="anonymous">
  {
    "imports": {
      "svelte": "${isDev ? "/@id/svelte" : "/lib/svelte/index.js"}",
      "svelte/animate": "${isDev ? "/@id/svelte/animate" : "/lib/svelte/animate.js"}",
      "svelte/easing": "${isDev ? "/@id/svelte/easing" : "/lib/svelte/easing.js"}",
      "svelte/motion": "${isDev ? "/@id/svelte/motion" : "/lib/svelte/motion.js"}",
      "svelte/store": "${isDev ? "/@id/svelte/store" : "/lib/svelte/store.js"}",
      "svelte/transition": "${isDev ? "/@id/svelte/transition" : "/lib/svelte/transition.js"}",
      "svelte/internal": "${isDev ? "/@id/svelte/internal" : "/lib/svelte/internal.js"}",
      "svelte/internal/client": "${isDev ? "/@id/svelte/internal/client" : "/lib/svelte/internal-client.js"}",
      "svelte/internal/disclose-version": "${isDev ? "/@id/svelte/internal/disclose-version" : "/lib/svelte/internal-disclose-version.js"}",
      "svelte/internal/flags/legacy": "${isDev ? "/@id/svelte/internal/flags/legacy" : "/lib/svelte/internal-flags-legacy.js"}",
      "svelte/internal/flags/async": "${isDev ? "/@id/svelte/internal/flags/async" : "/lib/svelte/internal-flags-async.js"}",
      "svelte/internal/flags/tracing": "${isDev ? "/@id/svelte/internal/flags/tracing" : "/lib/svelte/internal-flags-tracing.js"}",
      "svelte/internal/server": "${isDev ? "/@id/svelte/internal/server" : "/lib/svelte/internal-server.js"}",
      "svelte/legacy": "${isDev ? "/@id/svelte/legacy" : "/lib/svelte/legacy.js"}",
      "svelte/events": "${isDev ? "/@id/svelte/events" : "/lib/svelte/events.js"}",
      "svelte-i18n": "${isDev ? "/@id/svelte-i18n" : "/lib/svelte/i18n.js"}",
      "@panomc/sdk": "/lib/sdk/index.js",
      "@panomc/sdk/components/theme": "/lib/sdk/components-theme.js",
      "@panomc/sdk/components/panel": "/lib/sdk/components-panel.js",
      "@panomc/sdk/toasts": "/lib/sdk/toasts.js",
      "@panomc/sdk/utils/api": "/lib/sdk/utils-api.js",
      "@panomc/sdk/utils/auth": "/lib/sdk/utils-auth.js",
      "@panomc/sdk/utils/tooltip": "/lib/sdk/utils-tooltip.js",
      "@panomc/sdk/utils/language": "/lib/sdk/utils-language.js",
      "@panomc/sdk/utils/component": "/lib/sdk/utils-component.js",
      "@panomc/sdk/utils/text": "/lib/sdk/utils-text.js",
      "@panomc/sdk/variables": "/lib/sdk/variables.js",
      "@panomc/sdk/svelte": "/lib/sdk/svelte.js",
      "@panomc/sdk/internal": "/lib/sdk/internal.js"
    }
  }
  </script>`;
      return html.replace("%pano_lib_import%", importMap);
    },
  });

  const ct = response.headers.get("content-type") || "";
  if (ct.includes("text/html")) {
    const link = response.headers.get("link");
    if (link) {
      const filtered = stripModulePreload(link);
      if (filtered) response.headers.set("link", filtered);
      else response.headers.delete("link");
    }
  }

  return response;
}

/** @type {import('@sveltejs/kit').HandleServerError} */
export function handleError({ error, event }) {
  console.log("!!! [GLOBAL ERROR EVENT]:", event.url.href);
  console.error("!!! [GLOBAL ERROR CONTENT]:", error);
  return {
    message: 'Internal Error',
    code: error?.code
  };
}

/** @type {import("@sveltejs/kit").HandleFetch} */
export async function handleFetch({ event, request, fetch }) {
  if (request.url.startsWith(API_URL)) {
    request.headers.set("cookie", event.request.headers.get("cookie"));
    request.headers.set("Origin", API_URL);
  }

  return fetch(request);
}