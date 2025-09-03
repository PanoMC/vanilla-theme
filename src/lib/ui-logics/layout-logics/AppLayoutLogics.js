import { onDestroy, onMount, setContext } from "svelte";
import { writable } from "svelte/store";

import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { page } from "$app/stores";

import { initialized } from "$lib/Store";
import ApiUtil from "$lib/api.util";

import { init as initLanguage } from "$lib/language.util";

import { addListener } from "$lib/NotificationManager";
import { initializePlugins } from "$lib/PluginManager";
import { updateApiUrl, updatePanoWebsiteUrl } from "$lib/variables";

async function sendVisitorVisitRequest({ event, csrfToken }) {
  ApiUtil.post({ path: "/api/visitorVisit", request: event, csrfToken });
}

function initNotificationListeners() {
  addListener("AN_ADMIN_REPLIED_TICKET", async (notification) => {
    const {
      properties: { id }
    } = notification;

    await goto("/ticket/" + id, { invalidateAll: true });
  });

  addListener("AN_ADMIN_CLOSED_TICKET", async (notification) => {
    const {
      properties: { id }
    } = notification;

    await goto("/ticket/" + id, { invalidateAll: true });
  });
}

export async function processServerLoad(event) {
  const {
    locals: { user, csrfToken, apiUrlEnv, panoWebsiteUrlEnv }
  } = event;

  let siteInfo = await ApiUtil.get({
    path: "/api/siteInfo",
    request: event,
    csrfToken
  });

  return { user, csrfToken, siteInfo, apiUrlEnv, panoWebsiteUrlEnv };
}

export async function processLoad(event) {
  const {
    data: { user, csrfToken, siteInfo, apiUrlEnv, panoWebsiteUrlEnv },
    parent
  } = event;
  await parent();

  if (apiUrlEnv) {
    updateApiUrl(apiUrlEnv);
  }

  if (panoWebsiteUrlEnv) {
    updatePanoWebsiteUrl(panoWebsiteUrlEnv);
  }

  await initializePlugins(siteInfo);

  const output = {
    session: { user, csrfToken, siteInfo }
  };

  await initLanguage(siteInfo.locale, event);

  if (browser) {
    initNotificationListeners();
  }

  return output;
}

export function init(data) {
  const session = writable(data.session);
  const sidebar = writable(null);
  const sidebarProps = writable({});

  const pageUnsubscribe = page.subscribe((page) => {
    session.update(() => page.data.session);
    sidebar.update(() => page.data.sidebar);
    sidebarProps.update(() => page.data.sidebarProps || {});
  });

  setContext("session", session);
  setContext("sidebar", sidebar);
  setContext("sidebarProps", sidebarProps);

  onDestroy(pageUnsubscribe);

  onMount(() => {
    initialized.set(true);

    sendVisitorVisitRequest({});
  });

  return { session, sidebar, sidebarProps };
}
