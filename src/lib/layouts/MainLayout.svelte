<svelte:head>
  <meta content={$session.siteInfo.keywords.join(", ")} name="keywords" />
  <meta content={$session.siteInfo.websiteDescription} name="description" />

  <meta content={themeSettings.themeColor || "dark"} name="x-theme" />

  {@html `<style>;</style>`.replace(";", styles)}
</svelte:head>

<div class="vstack gap-3">
  <div class="vstack gap-{themeSettings.headerNavBarGap || '3'}">
    <Header />

    <Navbar />
  </div>

  <div class="container">
    <div class="vstack gap-3">
      <Hook name="theme:top" />

      {#if $page.url.pathname === "/"}
        <Hook name="page:home:top" />
      {/if}

      <Hook name="page:top" />
    </div>
  </div>

  <Main>
    <slot />
  </Main>

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
  import { page } from "$app/stores";

  import Header from "$lib/component/Header.svelte";
  import Navbar from "$lib/component/Navbar.svelte";
  import Main from "$lib/component/Main.svelte";
  import Footer from "$lib/component/Footer.svelte";
  import NotificationContainer from "$lib/component/NotificationContainer.svelte";
  import Hook from "$lib/component/Hook.svelte";

  const themeSettings = getContext("themeSettings");
  const session = getContext("session");

  const styles = `
    body {
      ${themeSettings.backgroundColor ? `background-color: ${themeSettings.backgroundColor} !important;` : ""}
      ${themeSettings.files?.backgroundImage ? `background-image: url(/api/theme/file/${themeSettings.files.backgroundImage}) !important;` : ""}
      ${themeSettings.bgImagePosition ? `background-position: ${themeSettings.bgImagePosition} !important;` : ""}
      ${themeSettings.bgImageRepeat ? `background-repeat: ${themeSettings.bgImageRepeat} !important;` : ""}
      ${themeSettings.bgImageSize ? `background-size: ${themeSettings.bgImageSize} !important;` : ""}
    }

    ${themeSettings.customCss || ""}
  `;
</script>
