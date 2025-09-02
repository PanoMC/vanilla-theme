<svelte:head>
  <title>{$session.siteInfo.websiteName}</title>
</svelte:head>

<App>
  <slot></slot>
</App>

<!-- Modals Start-->
<LoginModal />

<RegisterModal />

<NotificationContainer />

<script context="module">
  import { writable } from "svelte/store";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";

  import ApiUtil from "$lib/api.util.js";
  import { init as initLanguage } from "$lib/language.util";

  import { addListener } from "$lib/NotificationManager.js";
  import { initializePlugins } from "$lib/PluginManager.js";
  import { updateApiUrl, updatePanoWebsiteUrl } from "$lib/variables.js";

  function sendVisitorVisitRequest({ event, csrfToken }) {
    ApiUtil.post({ path: "/api/visitorVisit", request: event, csrfToken });
  }

  function initNotificationListeners() {
    addListener("AN_ADMIN_REPLIED_TICKET", (notification) => {
      const {
        properties: { id }
      } = notification;

      goto("/ticket/" + id, { invalidateAll: true });
    });

    addListener("AN_ADMIN_CLOSED_TICKET", (notification) => {
      const {
        properties: { id }
      } = notification;

      goto("/ticket/" + id, { invalidateAll: true });
    });
  }

  /**
   * @type {import("@sveltejs/kit").LayoutServerLoad}
   */
  export async function loadServer(event) {
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

  /**
   * @type {import("@sveltejs/kit").LayoutLoad}
   */
  export async function load(event) {
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
</script>

<script>
  import { onDestroy, onMount, setContext } from "svelte";

  import { page } from "$app/stores";

  import App from "$lib/component/App.svelte";

  import { initialized } from "$lib/Store.js";

  import LoginModal from "$lib/component/modals/LoginModal.svelte";
  import RegisterModal from "$lib/component/modals/RegisterModal.svelte";
  import NotificationContainer from "$lib/component/NotificationContainer.svelte";

  export let data;

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
</script>