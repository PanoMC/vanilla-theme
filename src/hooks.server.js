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
      const importMap = `
  <script type="importmap" crossorigin="anonymous">
  {
    "imports": {
      "svelte": "https://esm.sh/svelte@5.46.1",
      "svelte/": "https://esm.sh/svelte@5.46.1/"
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