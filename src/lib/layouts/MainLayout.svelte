<svelte:head>
  <meta content={$session.siteInfo.keywords.join(', ')} name="keywords" />
  <meta content={$session.siteInfo.websiteDescription} name="description" />

  {#if themeSettings.themeColor}
    <meta name="x-theme" content={themeSettings.themeColor} />
  {/if}

  {@html `<style>;</style>`.replace(";", styles)}
</svelte:head>

<div class="vstack gap-3">
  <div class="vstack gap-{themeSettings.headerNavBarGap || '3'}">
    <Header />

    <Navbar />
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

<script>
  import { getContext } from "svelte";

  import Header from "$lib/component/Header.svelte";
  import Navbar from "$lib/component/Navbar.svelte";
  import Main from "$lib/component/Main.svelte";
  import Footer from "$lib/component/Footer.svelte";
  import NotificationContainer from "$lib/component/NotificationContainer.svelte";

  const themeSettings = getContext("themeSettings");
  const session = getContext("session");

  const styles = `
    body {
      background-color: ${themeSettings.backgroundColor || "#f5f7fa"} !important;
      ${themeSettings.files?.backgroundImage ? `background-image: url(/api/theme/file/${themeSettings.files.backgroundImage}) !important;` : ""}
      ${themeSettings.bgImagePosition ? `background-position: ${themeSettings.bgImagePosition} !important;` : ""}
      ${themeSettings.bgImageRepeat ? `background-repeat: ${themeSettings.bgImageRepeat} !important;` : ""}
      ${themeSettings.bgImageSize ? `background-size: ${themeSettings.bgImageSize} !important;` : ""}
    }

    ${themeSettings.customCss || ""}
  `;
</script>
