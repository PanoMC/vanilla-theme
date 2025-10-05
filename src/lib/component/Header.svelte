<svelte:head>
  {@html `<style>;</style>`.replace(";", styles)}
</svelte:head>

<!-- Header -->
<div class:container={headerWidthOption !== "FULL_SIZE"}>
  <div
    class="rounded-bottom position-relative p-0 bg-gradient"
    class:bg-white={!themeSettings.headerBgColor}
    id="header"
    style="background-position: center; height: {themeSettings.headerHeight || '256'}px;">
    <a href="/">
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
    </a>
  </div>
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

  $: headerWidthOption = themeSettings.headerWidthOption || "BY_CONTENT";

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

  const defaultHeaderBg = typeof themeSettings.defaultHeaderBg === "undefined" ? true : themeSettings.defaultHeaderBg;

  const styles = `
    #header {
      ${themeSettings.headerBgColor ? `background-color: ${themeSettings.headerBgColor};` : ""}
      background-image: url(${defaultHeaderBg ? "/assets/img/default-header-bg.png" : themeSettings.files?.headerBackgroundImage ? "/api/theme/file/" + themeSettings.files?.headerBackgroundImage : ""}) !important;
      ${themeSettings.headerBgImagePosition ? `background-position: ${themeSettings.headerBgImagePosition} !important;` : ""}
      ${themeSettings.headerBgImageRepeat ? `background-repeat: ${themeSettings.headerBgImageRepeat} !important;` : ""}
      ${themeSettings.headerBgImageSize ? `background-size: ${themeSettings.headerBgImageSize} !important;` : ""}
    }
  `;
</script>
