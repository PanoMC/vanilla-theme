<!-- Footer -->
{#if themeSettings.footerContent}
  {@html themeSettings.footerContent}
{:else}
  <div class="container-fluid mt-5 border-top py-5">
    <div class="row justify-content-center align-items-center g-3">
      <div
        class="col-lg-4 d-flex justify-content-center align-items-center order-lg-first order-md-2 order-last">
        <ul class="nav nav-pills">
          <li class="nav-item">
            <a
              class="nav-link rounded-pill"
              href="/"
              aria-current="page"
              hidden={typeof themeSettings.navLinksEnableStatus?.home ===
              "undefined"
                ? false
                : !themeSettings.navLinksEnableStatus.home}>Ana Sayfa</a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link rounded-pill"
              href="/support"
              hidden={typeof themeSettings.navLinksEnableStatus?.support ===
              "undefined"
                ? false
                : !themeSettings.navLinksEnableStatus.support}>Destek</a>
          </li>
          <li
            class="nav-item"
            hidden={!$session.siteInfo.registerAgreement ||
              (typeof themeSettings.navLinksEnableStatus?.rules === "undefined"
                ? false
                : !themeSettings.navLinksEnableStatus.rules)}>
            <a class="nav-link rounded-pill" href="/rules">Kurallar</a>
          </li>
        </ul>
      </div>
      <div class="col-lg-4 col-sm-8">
        <div class="text-center vstack gap-3">
          <a href="/" class="d-inline-block">
            <img
              class="d-block mx-auto"
              height="128"
              width="128"
              alt={$_("components.header.alt")}
              src="/api/websiteLogo?hash={$session.siteInfo.websiteLogoHash}" />
          </a>
          <h5>{$session.siteInfo.websiteName}</h5>
          <small class="text-center">
            {$session.siteInfo.websiteDescription}
          </small>
        </div>
      </div>
      <div class="col-lg-4 d-flex justify-content-center align-items-center">
        <span class="badge fs-6 text-bg-primary user-select-all"
          >{$session.siteInfo.ipAddress}</span>
      </div>
      <div class="w-100"></div>
      <div class="col order-last">
        <div class="text-center mt-5">
          <small>
            {@html $_("footer.been-created-with", {
              values: {
                pano: `<a href="${PANO_WEBSITE_URL}" class="rounded focus-ring" target="_blank" rel="noreferrer">Pano</a>`,
              },
            })}
          </small>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Footer End -->
<script>
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";
  import { PANO_WEBSITE_URL } from "$lib/variables";

  const session = getContext("session");
  const themeSettings = getContext("themeSettings");
</script>
