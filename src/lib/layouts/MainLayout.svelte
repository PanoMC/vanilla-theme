<svelte:head>
  {#if themeSettings.themeColor}
    <meta name="x-theme" content={themeSettings.themeColor} />
  {/if}

  {@html `<style>;</style>`.replace(";", styles)}
</svelte:head>

<div class="vstack gap-3">
  <div class="vstack gap-0">
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
