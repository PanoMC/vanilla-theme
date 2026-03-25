<svelte:head>
  <meta content={$session.siteInfo.keywords.join(", ")} name="keywords" />
  <meta content={$session.siteInfo.websiteDescription} name="description" />

  <meta content={themeSettings.themeColor || "dark"} name="x-theme" />

  {@html `<style>;</style>`.replace(";", styles)}
</svelte:head>

<Hook name="theme:top" />

<div class="vstack gap-3 min-vh-100">
  <div class="vstack gap-{themeSettings.headerNavBarGap || '3'}">
    <Header />

    <Navbar />
  </div>

  <Hook name="page:top" />
  {#if breadcrumbEnabled}
    <Breadcrumb />
  {/if}

  {#if $pageTitle}
    <PageTitle
      title={typeof $pageTitle === "string" ? $_($pageTitle) : $pageTitle.title}
      subtitle={$pageTitle.subtitle}
      html={$pageTitle.html}
      subtitleHtml={$pageTitle.subtitleHtml} />
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
  import { page } from "$app/stores";

  import Header from "$lib/components/Header.svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import Main from "$lib/components/Main.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import NotificationContainer from "$lib/components/NotificationContainer.svelte";
  import Hook from "$lib/components/Hook.svelte";
  import Breadcrumb from "$lib/components/Breadcrumb.svelte";
  import PageTitle from "$lib/components/PageTitle.svelte";
  import { _ } from "svelte-i18n";

  const themeSettings = getContext("themeSettings");
  const session = getContext("session");
  const pageTitle = getContext("pageTitle");

  $: breadcrumbEnabled =
    (typeof themeSettings.breadcrumbEnabled === "undefined"
      ? true
      : themeSettings.breadcrumbEnabled) && $page.url.pathname !== "/";

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
