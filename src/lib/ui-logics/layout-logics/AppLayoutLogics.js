import { onDestroy, onMount, setContext } from "svelte";
import { writable } from "svelte/store";
import { setPanoContext } from "@panomc/sdk/internal";
import { _ } from "svelte-i18n";
import copy from "copy-to-clipboard";

import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { navigating, page } from "$app/stores";
import { base } from "$app/paths";
import { error, redirect } from "@sveltejs/kit";

import { initialized } from "$lib/Store";

import * as languageStuff from "$lib/language.util";
import ApiUtil, * as ApiUtilStuff from "$lib/api.util";
import * as variableStuff from "$lib/variables";
import { checkDomainRedirection, updateApiUrl, updatePanoWebsiteUrl } from "$lib/variables";
import * as toastStuff from "$lib/component/ToastContainer.svelte";
import tooltip from "$lib/tooltip.util";

import { addListener } from "$lib/NotificationManager";
import { initializePlugins, preparePlugins } from "$lib/PluginManager";
import { executeLifecycle } from "$lib/PluginAPI";
import { hasPermission } from "$lib/auth.util";

import Date from "$lib/component/Date.svelte";
import Pagination from "$lib/component/Pagination.svelte";
import NoContent from "$lib/component/NoContent.svelte";
import PageActions from "$lib/component/PageActions.svelte";
import PageTitle from "$lib/component/PageTitle.svelte";
import PlayerHead from "$lib/component/PlayerHead.svelte";

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

  if (browser) {
    checkDomainRedirection();
  }

  setPanoContext({
    page,
    base,
    navigating,
    browser,
    goto,
    error,
    redirect,
    components: {
      Date,
      Pagination,
      NoContent,
      PageActions,
      PageTitle,
      PlayerHead
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
      toast: {
        ...toastStuff,
      },
      auth: {
        hasPermission
      },
      text: {
        copy
      },
    },
    variables: {
      ...variableStuff,
    },
  });

  await initializePlugins(siteInfo);

  const output = {
    session: { user, csrfToken, siteInfo },
    pageTitle: writable(null)
  };

  await executeLifecycle("theme:app:load", output, event);

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

  const { pageTitle } = data;
  return { session, sidebar, sidebarProps, pageTitle };
}
