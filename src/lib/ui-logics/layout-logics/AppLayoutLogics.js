import { onDestroy, onMount, setContext } from "svelte";
import { get, writable } from "svelte/store";
import { setPanoContext } from "@panomc/sdk/internal";
import { _ } from "svelte-i18n";
import copy from "copy-to-clipboard";

import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { navigating, page } from "$app/stores";
import { base } from "$app/paths";
import { error, redirect } from "@sveltejs/kit";

import { avatarVersion, initialized } from "$lib/Store";

import * as languageStuff from "$lib/language.util";
import ApiUtil, * as ApiUtilStuff from "$lib/api.util";
import * as variableStuff from "$lib/variables";
import { checkDomainRedirection, updateApiUrl, updatePanoWebsiteUrl } from "$lib/variables";
import * as toastStuff from "$lib/components/ToastContainer.svelte";
import tooltip from "$lib/tooltip.util";

import { addListener } from "$lib/NotificationManager";
import { initializePlugins, preparePlugins } from "$lib/PluginManager";
import { executeLifecycle, executeViewLoad } from "$lib/PluginAPI";
import { hasPermission } from "$lib/auth.util";

import DateComponent from "$lib/components/Date.svelte";
import Pagination from "$lib/components/Pagination.svelte";
import NoContent from "$lib/components/NoContent.svelte";
import PageActions from "$lib/components/PageActions.svelte";
import PageTitle from "$lib/components/PageTitle.svelte";
import PlayerHead from "$lib/components/PlayerHead.svelte";

const initLanguage = languageStuff.init;

async function sendVisitorVisitRequest({ event, csrfToken, isDemo }) {
  if (isDemo) return;
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

  const avatarVersionDate = `v=${Date.now()}`;

  return {
    user,
    csrfToken,
    siteInfo,
    apiUrlEnv,
    panoWebsiteUrlEnv,
    avatarVersionDate,
  };
}

export async function processLoad(event) {
  const {
    data: {
      user,
      csrfToken,
      siteInfo,
      apiUrlEnv,
      panoWebsiteUrlEnv,
      avatarVersionDate,
    },
    parent,
  } = event;
  await parent();
  avatarVersion.set(avatarVersionDate);

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
      Date: DateComponent,
      Pagination,
      NoContent,
      PageActions,
      PageTitle,
      PlayerHead,
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
        hasPermission,
      },
      text: {
        copy,
      },
    },
    variables: {
      ...variableStuff,
    },
  });

  if (!browser || !get(initialized)) {
    await initializePlugins(siteInfo);
  }

  const output = {
    session: { user, csrfToken, siteInfo },
    pageTitle: writable(null)
  };

  await executeLifecycle("theme:navbar:load", output, event);

  // Resolve navbar dynamic components
  await executeViewLoad("navbar-right", event);
  await executeViewLoad("navbar-profile-dropdown", event);

  await executeLifecycle("theme:app:load", output, event);

  await initLanguage(siteInfo.locale, event);

  if (browser && !get(initialized)) {
    initNotificationListeners();
  }

  return output;
}

export function init(data) {
  const session = writable(data.session);
  const sidebar = writable(null);
  const sidebarProps = writable({});

  const pageUnsubscribe = page.subscribe((page) => {
    session.update((current) => {
      const incoming = page.data.session;
      if (!incoming) return current;

      // Preserve client-side auth state changes (login/logout) that haven't
      // been reflected in page.data yet due to client-side navigation
      // without a server-side reload.
      if (!!current?.user !== !!incoming.user) {
        return { ...incoming, user: current.user, csrfToken: current.csrfToken };
      }

      return incoming;
    });
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

    sendVisitorVisitRequest({ isDemo: data.session.siteInfo.isDemo });
  });

  const { pageTitle } = data;
  return { session, sidebar, sidebarProps, pageTitle };
}
