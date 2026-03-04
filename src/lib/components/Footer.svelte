<style>
  .no-caret::after {
    display: none !important;
  }
</style>

<!-- Footer -->
{#if themeSettings.footerContent}
  {@html themeSettings.footerContent}
{:else}
  <div class="container mt-5 border-top py-5">
    <div class="row justify-content-center align-items-center g-3">
      <div
        class="col-lg-4 d-flex justify-content-center align-items-center order-lg-first order-md-2 order-last">
        <ul
          bind:this={navElement}
          class="nav nav-pills justify-content-lg-start justify-content-center small flex-nowrap overflow-visible">
          {#each visibleLinks as link, i (link.id)}
            <li class="nav-item" bind:this={itemElements[i]}>
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

          {#if moreLinks.length > 0}
            <li class="nav-item dropdown" bind:this={moreButtonElement}>
              <button
                class="nav-link rounded-pill small dropdown-toggle no-caret"
                data-bs-toggle="dropdown"
                type="button"
                aria-expanded="false">
                <i class="fa-solid fa-ellipsis"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                {#each moreLinks as link (link.id)}
                  <li>
                    <a
                      class="dropdown-item small"
                      href={link.href}
                      target={link.target}>
                      {link.text && link.text.includes(".")
                        ? $_(link.text)
                        : link.text}
                    </a>
                  </li>
                {/each}
              </ul>
            </li>
          {/if}
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
  import { getContext, onMount, tick } from "svelte";
  import { browser } from "$app/environment";
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

  let navElement;
  let itemElements = [];
  let moreButtonElement;
  let visibleLinksState = null;
  let moreLinksState = [];
  let isChecking = false;

  $: visibleLinks = visibleLinksState || displayLinks;
  $: moreLinks = moreLinksState;

  async function updateOverflow() {
    if (!browser || !navElement || isChecking) return;
    isChecking = true;

    // Measurement phase
    visibleLinksState = displayLinks;
    moreLinksState = [];
    await tick();

    if (itemElements.length === 0) {
      isChecking = false;
      return;
    }

    const containerWidth = navElement.clientWidth;
    const moreButtonWidth = 50; // Conservative estimate for "..." button
    const maxLinks = 3;

    // Calculate item widths
    const widths = itemElements.map((el) => (el ? el.offsetWidth : 0));

    let cutIndex = -1;
    let currentWidth = 0;

    for (let i = 0; i < widths.length; i++) {
      // Logic for cutting:
      // 1. If we exceed the maximum allowed links (3)
      // 2. OR if adding this link (plus the "..." button placeholder) exceeds the container width
      const isWidthExceeded =
        currentWidth + widths[i] + moreButtonWidth > containerWidth;
      const isCountExceeded = i >= maxLinks;

      if (isCountExceeded || isWidthExceeded) {
        cutIndex = i;
        break;
      }
      currentWidth += widths[i];
    }

    if (cutIndex !== -1 && cutIndex < displayLinks.length) {
      visibleLinksState = displayLinks.slice(0, cutIndex);
      moreLinksState = displayLinks.slice(cutIndex);
    } else {
      visibleLinksState = displayLinks;
      moreLinksState = [];
    }

    isChecking = false;
  }

  onMount(() => {
    updateOverflow();
    const observer = new ResizeObserver(updateOverflow);
    observer.observe(navElement);
    return () => observer.disconnect();
  });

  $: if (displayLinks) {
    itemElements = [];
    updateOverflow();
  }
</script>
