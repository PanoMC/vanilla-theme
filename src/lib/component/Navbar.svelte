<!-- Navbar -->
<div class:container={themeSettings.navbarWidthOption !== "FULL_SIZE"}>
  <nav
    class="navbar navbar-expand-lg navbar-dark bg-primary bg-gradient rounded rounded-{themeSettings.navRoundLevel
      ? +themeSettings.navRoundLevel
      : '5'}">
    <div class="container">
      <ul class="navbar-nav flex-row me-auto">
        <li>
          <button
            aria-label={$_("buttons.toggle")}
            class="navbar-toggler d-lg-none"
            data-bs-target="#navbar"
            data-bs-toggle="collapse"
            type="button">
            <i aria-hidden="true" class="fa fa-bars"></i>
          </button>
        </li>
      </ul>

      <ul class="navbar-nav flex-row ml-auto order-lg-last gap-lg-0 gap-3">
        {#if $session.user && $session.user.panelAccess}
          <li class="nav-item">
            <a
              class="nav-link"
              href={PANEL_URL}
              target="_blank"
              rel="noreferrer">
              <i class="fa-solid fa-user-tie"></i>
              <span class="d-none d-lg-inline ms-2">
                {$_("nav-links.panel")}</span>
            </a>
          </li>
        {/if}

        {#if $session.user}
          <!-- User Dropdown -->
          <li class="nav-item dropdown position-relative">
            <button
              type="button"
              class="nav-link position-relative"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              title={$session.user.username}>
              <img
                alt={$session.user.username}
                class="rounded d-block m-auto"
                src="https://minotar.net/avatar/{$session.user.username}"
                width="24"
                height="24" />
              {#if $notificationsCount !== 0}
                <span
                  class="position-absolute top-0 end-0 badge rounded-pill bg-danger px-2 py-1">
                  {$notificationsCount}
                </span>
              {/if}
            </button>
            <ul class="dropdown-menu dropdown-menu-end position-absolute">
              <h6 class="dropdown-header">{$session.user.username}</h6>
              <li>
                <a
                  class:active={matching($page.url.pathname, "/profile")}
                  class="dropdown-item focus-ring"
                  href="/profile">{$_("buttons.profile")}</a>
              </li>
              <li>
                <a
                  class:active={matching($page.url.pathname, "/notifications")}
                  class="dropdown-item focus-ring position-relative"
                  href="/notifications">{$_("buttons.notifications")}
                  {#if $notificationsCount !== 0}
                    <span
                      class="position-absolute top-0 badge rounded-pill bg-danger p-1 d-inline">
                    </span>
                  {/if}</a>
              </li>
              <li>
                <a
                  class:active={matching($page.url.pathname, "/tickets")}
                  class="dropdown-item focus-ring"
                  href="/tickets">{$_("buttons.tickets")}</a>
              </li>
              <li>
                <a
                  class:active={matching(
                    $page.url.pathname,
                    "/profile/settings",
                  )}
                  class="dropdown-item focus-ring"
                  href="/profile/settings">{$_("buttons.settings")}</a>
              </li>
              <li>
                <button
                  type="button"
                  class="dropdown-item focus-ring link-danger"
                  on:click={logout}>{$_("buttons.logout")}</button>
              </li>
            </ul>
          </li>
        {:else}
          <li class="nav-item me-xl-0 me-3">
            <a href="/login" class="nav-link">
              {$_("buttons.login")}
            </a>
          </li>
          <li class="nav-item">
            <a href="/register"
               class="btn btn-secondary rounded-pill">
              {$_("buttons.register")}
            </a>
          </li>
        {/if}
      </ul>

      {#if typeof themeSettings.navLinksEnabled === "undefined" ? true : themeSettings.navLinksEnabled}
        <div class="collapse navbar-collapse" id="navbar">
          <ul class="navbar-nav mr-auto mt-2 mt-lg-0 text-lg-left text-center">
            {#each displayLinks as link (link.id)}
              <li class="nav-item">
                <a
                  href={link.href}
                  target={link.target}
                  class="nav-link"
                  class:active={matching($page.url.pathname, link.href, link.startsWith)}
                  title={link.text && link.text.includes(".") ? $_(link.text) : link.text}>
                  {#if link.icon}
                    <i class="{link.icon} me-1" aria-hidden="true"></i>
                  {/if}
                  {link.text && link.text.includes(".") ? $_(link.text) : link.text}
                </a>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  </nav>
</div>

<!-- Navbar End -->
<script>
  import { getContext, onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import { Collapse } from "bootstrap";

  import { page } from "$app/stores";
  import { PANEL_URL } from "$lib/variables.js";

  import { logout, notificationsCount } from "$lib/Store";
  import { panoApiClient } from "$lib/PluginAPI.js";
  import { hasPermission } from "$lib/auth.util.js";

  const navLinks = panoApiClient.ui.nav.site.getNavLinks();

  let navbarCollapseInstance = null;

  onMount(() => {
    const navbarElement = document.getElementById("navbar");
    if (navbarElement) {
      navbarCollapseInstance = Collapse.getOrCreateInstance(navbarElement, { toggle: false });
    }
  });

  // Close navbar when page changes on mobile
  $: if ($page.url.pathname && navbarCollapseInstance) {
    navbarCollapseInstance.hide();
  }

  const session = getContext("session");
  const themeSettings = getContext("themeSettings");

  $: navbarWidthOption = themeSettings.navbarWidthOption || "BY_CONTENT";

  $: nativeLinks = [
    { id: "home", text: "nav-links.homepage", href: "/" },
    { id: "support", text: "nav-links.support", href: "/support" },
    {
      id: "rules",
      text: "nav-links.rules",
      href: "/rules",
      condition: !!$session.siteInfo?.registerAgreement
    }
  ];

  function matching(path, pathName, startsWith = false) {
    return (
      path.toUpperCase() === pathName?.toUpperCase() ||
      path.toUpperCase() === (pathName + "/").toUpperCase() ||
      (startsWith && path.startsWith(pathName))
    );
  }

  $: displayLinks = (() => {
    // 1. Merge
    const pluginLinks = $navLinks.map((l) => ({
      ...l,
      id: l.href,
      isPlugin: true,
      target: l.target === "_self" ? null : l.target
    }));

    const allLinks = [...nativeLinks, ...pluginLinks];

    // 2. Sort
    let order = themeSettings.navLinksOrder || [];
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
      // Only add if not already added (check ID presence in map is strictly better if duplicates exist in source, but here IDs are unique-ish)
      if (!inOrderIds.has(l.id)) {
        sorted.push(l);
      }
    }

    // 3. Filter visibility & conditions
    return sorted.filter((link) => {
      // Check explicit toggle first
      // Note: Default for native links was traditionally TRUE if undefined.
      // Default for plugin links should also be TRUE.
      const status = themeSettings.navLinksEnableStatus?.[link.id];
      if (status === false) return false; // Explicitly disabled

      // Check custom condition (e.g. Rules agreement)
      if (typeof link.condition !== "undefined" && !link.condition) return false;

      // Check plugin conditions
      if (link.loginRequired && !$session.user) return false;
      if (link.permission && !hasPermission(link.permission)) return false;

      return true;
    });
  })();
</script>
