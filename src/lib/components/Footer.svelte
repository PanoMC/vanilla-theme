<!-- Footer -->
{#if themeSettings.footerContent}
  {@html themeSettings.footerContent}
{:else}
  <div class="container-fluid mt-5 border-top py-5">
    <div class="row justify-content-center align-items-center g-3">
      <div
        class="col-lg-4 d-flex justify-content-center align-items-center order-lg-first order-md-2 order-last">
        <ul class="nav nav-pills justify-content-center">
          {#each displayLinks as link (link.id)}
            <li class="nav-item">
              <a
                class="nav-link rounded-pill small"
                href={link.href}
                target={link.target}
                title={link.text && link.text.includes(".")
                  ? $_(link.text)
                  : link.text}>
                {link.text && link.text.includes(".")
                  ? $_(link.text)
                  : link.text}
              </a>
            </li>
          {/each}
        </ul>
      </div>
      <div class="col-lg-4 col-sm-8">
        <div class="text-center vstack align-items-center gap-3">
          <a href="/" class="d-inline-block">
            <img
              class="d-block mx-auto"
              width="128"
              height="auto"
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
        <span class="badge fs-6 text-bg-secondary user-select-all"
          >{$session.siteInfo.ipAddress}</span>
      </div>
      <div class="w-100"></div>
      <div class="col order-last">
        <div class="text-center vstack align-items-center mt-5">
          <a
            href={PANO_WEBSITE_URL}
            target="_blank"
            rel="noreferrer"
            class="d-inline-flex align-items-center justify-content-center bg-primary rounded-3 mb-2"
            style="width: 32px; height: 32px;"
            title="Pano">
            <img src="/assets/img/logo.svg" width="20" height="20" alt="Pano" />
          </a>
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
  import { panoApiClient } from "$lib/PluginAPI.js";
  import { hasPermission } from "$lib/auth.util.js";

  const session = getContext("session");
  const themeSettings = getContext("themeSettings");

  const navLinks = panoApiClient.ui.nav.site.getNavLinks();

  $: nativeLinks = [
    { id: "home", text: "nav-links.homepage", href: "/" },
    { id: "support", text: "nav-links.support", href: "/support" },
    {
      id: "rules",
      text: "nav-links.rules",
      href: "/rules",
      condition: !!$session.siteInfo?.registerAgreement,
    },
  ];

  $: displayLinks = (() => {
    // Check if footer links are globally disabled
    if (themeSettings.footerLinksEnabled === false) return [];

    // 1. Merge
    const pluginLinks = $navLinks.map((l) => ({
      ...l,
      id: l.href,
      isPlugin: true,
      target: l.target === "_self" ? null : l.target,
    }));

    const allLinks = [...nativeLinks, ...pluginLinks];

    // 2. Sort
    let order = themeSettings.footerLinksOrder || [];
    const sourceMap = new Map(allLinks.map((l) => [l.id, l]));
    const sorted = [];

    // Add ordered items
    for (const id of order) {
      if (sourceMap.has(id)) {
        sorted.push(sourceMap.get(id));
      }
    }

    // Append remaining items (ordered set first to avoid duplicates)
    const inOrderIds = new Set(order);
    for (const l of allLinks) {
      if (!inOrderIds.has(l.id)) {
        sorted.push(l);
      }
    }

    // 3. Filter visibility & conditions
    return sorted.filter((link) => {
      // Handle plugin links visibility setting
      if (link.isPlugin && themeSettings.footerPluginLinksEnabled === false)
        return false;

      // Check explicit footer toggle for individual link
      const status = themeSettings.footerLinksEnableStatus?.[link.id];
      if (status === false) return false;

      if (typeof link.condition !== "undefined" && !link.condition)
        return false;

      if (link.loginRequired && !$session.user) return false;
      if (link.permission && !hasPermission(link.permission)) return false;

      return true;
    });
  })();
</script>
