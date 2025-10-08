<svelte:head>
  <link href="/api/favicon?hash={$session.siteInfo.faviconHash}" rel="icon" />

  <title>{$session.siteInfo.websiteName}</title>
</svelte:head>

<App>
  <slot></slot>
</App>

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
  import { init } from "$lib/ui-logics/layout-logics/AppLayoutLogics";

  import App from "$lib/component/App.svelte";

  export let data;

  const { session } = init(data);
</script>