<svelte:head>
  <link href="/api/favicon?hash={$session.siteInfo.faviconHash}" rel="icon" />

  <title>{title}</title>
</svelte:head>

<App>
  <slot></slot>
</App>

<ToastContainer />

<script context="module">
  import { processLoad, processServerLoad } from "$lib/ui-logics/layout-logics/AppLayoutLogics";

  /**
   * @type {import("@sveltejs/kit").LayoutServerLoad}
   */
  export async function loadServer(event) {
    return await processServerLoad(event);
  }

  /**
   * @type {import("@sveltejs/kit").LayoutLoad}
   */
  export async function load(event) {
    return await processLoad(event);
  }
</script>

<script>
  import { _ } from "svelte-i18n";

  import { init } from "$lib/ui-logics/layout-logics/AppLayoutLogics";

  import App from "$lib/components/App.svelte";
  import ToastContainer from "$lib/components/ToastContainer.svelte";

  export let data;

  const { session, pageTitle } = init(data);

  $: title = $pageTitle
    ? `${$_($pageTitle)} \u2014 ${$session.siteInfo.websiteName}`
    : $session.siteInfo.websiteName;
</script>