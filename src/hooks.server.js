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

const isDev = process.env.NODE_ENV === "development";
// Cache buster to prevent stale browser cache when switching themes.
// Each process start (theme switch) generates a new value, forcing fresh file downloads.
const v = isDev ? '' : `?v=${Date.now()}`;
const importMap = `
  <script type="importmap" crossorigin="anonymous">
  {
    "imports": {
      "svelte": "${isDev ? "/@id/svelte" : `/lib/svelte/index.js${v}`}",
      "svelte/animate": "${isDev ? "/@id/svelte/animate" : `/lib/svelte/animate.js${v}`}",
      "svelte/easing": "${isDev ? "/@id/svelte/easing" : `/lib/svelte/easing.js${v}`}",
      "svelte/motion": "${isDev ? "/@id/svelte/motion" : `/lib/svelte/motion.js${v}`}",
      "svelte/store": "${isDev ? "/@id/svelte/store" : `/lib/svelte/store.js${v}`}",
      "svelte/transition": "${isDev ? "/@id/svelte/transition" : `/lib/svelte/transition.js${v}`}",
      "svelte/internal": "${isDev ? "/@id/svelte/internal" : `/lib/svelte/internal.js${v}`}",
      "svelte/internal/client": "${isDev ? "/@id/svelte/internal/client" : `/lib/svelte/internal-client.js${v}`}",
      "svelte/internal/disclose-version": "${isDev ? "/@id/svelte/internal/disclose-version" : `/lib/svelte/internal-disclose-version.js${v}`}",
      "svelte/internal/flags/legacy": "${isDev ? "/@id/svelte/internal/flags/legacy" : `/lib/svelte/internal-flags-legacy.js${v}`}",
      "svelte/internal/flags/async": "${isDev ? "/@id/svelte/internal/flags/async" : `/lib/svelte/internal-flags-async.js${v}`}",
      "svelte/internal/flags/tracing": "${isDev ? "/@id/svelte/internal/flags/tracing" : `/lib/svelte/internal-flags-tracing.js${v}`}",
      "svelte/internal/server": "${isDev ? "/@id/svelte/internal/server" : `/lib/svelte/internal-server.js${v}`}",
      "svelte/legacy": "${isDev ? "/@id/svelte/legacy" : `/lib/svelte/legacy.js${v}`}",
      "svelte/events": "${isDev ? "/@id/svelte/events" : `/lib/svelte/events.js${v}`}",
      "svelte-i18n": "${isDev ? "/@id/svelte-i18n" : `/lib/svelte/i18n.js${v}`}",
      "@panomc/sdk": "/lib/sdk/index.js${v}",
      "@panomc/sdk/components/theme": "/lib/sdk/components-theme.js${v}",
      "@panomc/sdk/components/panel": "/lib/sdk/components-panel.js${v}",
      "@panomc/sdk/toasts": "/lib/sdk/toasts.js${v}",
      "@panomc/sdk/utils/api": "/lib/sdk/utils-api.js${v}",
      "@panomc/sdk/utils/auth": "/lib/sdk/utils-auth.js${v}",
      "@panomc/sdk/utils/tooltip": "/lib/sdk/utils-tooltip.js${v}",
      "@panomc/sdk/utils/language": "/lib/sdk/utils-language.js${v}",
      "@panomc/sdk/utils/component": "/lib/sdk/utils-component.js${v}",
      "@panomc/sdk/utils/text": "/lib/sdk/utils-text.js${v}",
      "@panomc/sdk/variables": "/lib/sdk/variables.js${v}",
      "@panomc/sdk/svelte": "/lib/sdk/svelte.js${v}",
      "@panomc/sdk/internal": "/lib/sdk/internal.js${v}"
    }
  }
  </script>
  <script src="/lib/bootstrap/bootstrap.bundle.min.js${v}"></script>`;
const IMPORT_MAP_PLACEHOLDER = "%pano_lib_import%";
const IMPORT_MAP_PLACEHOLDER_LEN = IMPORT_MAP_PLACEHOLDER.length;

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
      const index = html.indexOf(IMPORT_MAP_PLACEHOLDER);
      if (index === -1) return html;
      return html.substring(0, index) + importMap + html.substring(index + IMPORT_MAP_PLACEHOLDER_LEN);
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