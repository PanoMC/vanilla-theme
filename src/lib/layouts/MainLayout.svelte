<svelte:head>
  <meta content={$session.siteInfo.keywords.join(", ")} name="keywords" />
  <meta content={$session.siteInfo.websiteDescription} name="description" />

  <meta content={themeSettings.themeColor || "dark"} name="x-theme" />

  {@html `<style>;</style>`.replace(";", styles)}
</svelte:head>

<Hook name="theme:top" />

<div class="vstack gap-3 min-vh-100">
  <div class="vstack gap-{themeSettings.headerNavBarGap || '3'} flex-grow-0">
    <Header />

    <Navbar />
  </div>

  <Hook name="page:top" />
  {#if breadcrumbEnabled}
    <Breadcrumb />
  {/if}

  <div class="flex-grow-1">
    <Main>
      <slot />
    </Main>
  </div>

  {#if typeof themeSettings.footerEnabled === "undefined" ? true : themeSettings.footerEnabled}
    <Footer />
  {/if}
</div>
  
<NotificationContainer />

<!-- Modals End -->

<script context="module">
  import { processLoad } from "$lib/ui-logics/layout-logics/MainLayoutLogics";

  /**
   * @type {import("@sveltejs/kit").LayoutLoad}
   */
  export async function load(event) {
    return await processLoad(event);
  }
</script>

<script>
  import { getContext } from "svelte";

  import Header from "$lib/components/Header.svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import Main from "$lib/components/Main.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import NotificationContainer from "$lib/components/NotificationContainer.svelte";
  import Hook from "$lib/components/Hook.svelte";
  import Breadcrumb from "$lib/components/Breadcrumb.svelte";

  const themeSettings = getContext("themeSettings");
  const session = getContext("session");

  // Global kill-switch from theme settings. Individual pages opt in to
  // the breadcrumb by returning a `breadcrumbs` array from their load();
  // the Breadcrumb component renders nothing when no items are provided.
  $: breadcrumbEnabled =
    typeof themeSettings.breadcrumbEnabled === "undefined"
      ? true
      : themeSettings.breadcrumbEnabled;

  const styles = `
    body {
      min-height: 100vh;
      ${themeSettings.backgroundColor ? `background-color: ${themeSettings.backgroundColor} !important;` : ""}
      ${themeSettings.files?.backgroundImage ? `background-image: url(/api/theme/file/${themeSettings.files.backgroundImage}) !important;` : ""}
      ${themeSettings.bgImagePosition ? `background-position: ${themeSettings.bgImagePosition} !important;` : ""}
      ${themeSettings.bgImageRepeat ? `background-repeat: ${themeSettings.bgImageRepeat} !important;` : ""}
      ${themeSettings.bgImageSize ? `background-size: ${themeSettings.bgImageSize} !important;` : ""}
    }

    ${themeSettings.customCss || ""}
  `;
</script>
