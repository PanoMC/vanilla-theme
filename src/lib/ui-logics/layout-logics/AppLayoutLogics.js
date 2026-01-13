import { onDestroy, onMount, setContext } from "svelte";
import { writable } from "svelte/store";
import { setPanoContext } from "@panomc/sdk/internal";
import { _ } from "svelte-i18n";

import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { navigating, page } from "$app/stores";
import { base } from "$app/paths";

import { initialized } from "$lib/Store";

import * as languageStuff from "$lib/language.util";
import ApiUtil, * as ApiUtilStuff from "$lib/api.util";
import * as variableStuff from "$lib/variables";
import tooltip from "$lib/tooltip.util";

import { addListener } from "$lib/NotificationManager";
import { preparePlugins, initializePlugins } from "$lib/PluginManager";
import { updateApiUrl, updatePanoWebsiteUrl } from "$lib/variables";

import Date from "$lib/component/Date.svelte"
import { executeHookLoad } from "$lib/PluginAPI.js";

const initLanguage = languageStuff.init;

async function sendVisitorVisitRequest({ event, csrfToken }) {
  ApiUtil.post({ path: "/api/visitorVisit", request: event, csrfToken });
}

function initNotificationListeners() {
  addListener("AN_ADMIN_REPLIED_TICKET", async (notification) => {
    const {
      details: { id }
    } = notification;

    await goto("/ticket/" + id, { invalidateAll: true });
  });

  addListener("AN_ADMIN_CLOSED_TICKET", async (notification) => {
    const {
      details: { id }
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

  await preparePlugins(siteInfo);

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

  setPanoContext({
    page,
    base,
    navigating,
    browser,
    components: {
      Date,
    },
    utils: {
      api: {
        ApiUtil,
        ...ApiUtilStuff,
      },
      language: {
        ...languageStuff,
        _,
      },
      tooltip: {
        tooltip,
      },
    },
    variables: {
      ...variableStuff,
    },
  });

  await initializePlugins(siteInfo);

  const output = {
    session: { user, csrfToken, siteInfo },
    hookProps: {
      'theme:top': await executeHookLoad('theme:top', event),
      'page:top': await executeHookLoad('page:top', event)
    }
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
  setContext("themeSettings", data.session.siteInfo.themeSettings);

  onDestroy(pageUnsubscribe);

  onMount(() => {
    initialized.set(true);

    sendVisitorVisitRequest({});
  });

  return { session, sidebar, sidebarProps };
}
