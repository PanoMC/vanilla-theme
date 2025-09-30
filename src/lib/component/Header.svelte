<svelte:head>
  {@html `<style>;</style>`.replace(";", styles)}
</svelte:head>

<!-- Header -->
<div class:bg-white={!themeSettings.headerBgColor} id="header">
  <div class="{themeSettings.headerWidthOption === 'FULL_SIZE' ? 'container-fluid' : 'container'} text-center"
       style="{themeSettings.headerHeight ? `height: ${themeSettings.headerHeight}px;` : ''}">
    <img
      title={$session.siteInfo.websiteName}
      alt={$_("components.header.alt")}
      class="{(themeSettings.logoHeight || themeSettings.logoWidth) ? '' : 'img-fluid'} m-auto p-3"
      class:d-none="{themeSettings.logoVisibility === false}"
      height="{themeSettings.logoHeight || 'auto'}"
      src="/api/websiteLogo?hash={$session.siteInfo.websiteLogoHash}"
      width="{themeSettings.logoWidth || 'auto'}" />
  </div>
</div>

<!-- Header End -->

<script>
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";

  const session = getContext("session");
  const themeSettings = getContext("themeSettings");

  const styles = `
    #header {
      ${themeSettings.headerBgColor ? `background-color: ${themeSettings.headerBgColor};` : ""}
      ${themeSettings.files?.headerBackgroundImage ? `background-image: url(/api/theme/file/${themeSettings.files.headerBackgroundImage}) !important;` : ""}
    }
  `;
</script>
