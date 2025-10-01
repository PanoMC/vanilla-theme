<svelte:head>
  {@html `<style>;</style>`.replace(";", styles)}
</svelte:head>

<!-- Header -->
<div
  class="rounded {themeSettings.headerWidthOption === 'FULL_SIZE'
    ? 'container-fluid'
    : 'container'} position-relative"
  class:bg-white={!themeSettings.headerBgColor}
  id="header"
  style="height: {themeSettings.headerHeight || '256'}px;">
  <img
    alt={$_("components.header.alt")}
    class="{themeSettings.logoHeight || themeSettings.logoWidth
      ? ''
      : 'img-fluid'} p-3 position-absolute {logoPositionClasses}"
    class:d-none={themeSettings.logoVisibility === false}
    height={themeSettings.logoHeight || "auto"}
    src="/api/websiteLogo?hash={$session.siteInfo.websiteLogoHash}"
    style="{!themeSettings.logoHeight && !themeSettings.logoWidth
      ? 'height: 100%; width: 100%; object-fit: contain;'
      : ''} "
    title={$session.siteInfo.websiteName}
    width={themeSettings.logoWidth || "auto"} />
</div>

<!-- Header End -->

<script>
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";

  const session = getContext("session");
  const themeSettings = getContext("themeSettings");

  $: logoPosition = themeSettings.logoPosition
    ? themeSettings.logoPosition
    : "CENTER";
  $: logoPositionClasses = getLogoPositionClasses(logoPosition);

  function getLogoPositionClasses(logoPosition) {
    if (logoPosition === "TOP_START") {
      return "top-0 start-0";
    } else if (logoPosition === "TOP") {
      return "top-0 start-50 translate-middle-x";
    } else if (logoPosition === "TOP_END") {
      return "top-0 end-0";
    } else if (logoPosition === "CENTER_START") {
      return "top-50 start-0 translate-middle-y";
    } else if (logoPosition === "CENTER") {
      return "top-50 start-50 translate-middle";
    } else if (logoPosition === "CENTER_END") {
      return "top-50 end-0 translate-middle-y";
    } else if (logoPosition === "BOTTOM_START") {
      return "bottom-0 start-0 ";
    } else if (logoPosition === "BOTTOM") {
      return "bottom-0 start-50 translate-middle-x";
    } else if (logoPosition === "BOTTOM_END") {
      return "bottom-0 end-0";
    }

    return "top-50 start-50 translate-middle";
  }

  const styles = `
    #header {
      ${themeSettings.headerBgColor ? `background-color: ${themeSettings.headerBgColor};` : ""}
      ${themeSettings.files?.headerBackgroundImage ? `background-image: url(/api/theme/file/${themeSettings.files.headerBackgroundImage}) !important;` : ""}
    }
  `;
</script>
