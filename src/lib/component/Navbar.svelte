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
            <li
              class="nav-item"
              hidden={typeof themeSettings.navLinksEnableStatus?.home ===
              "undefined"
                ? false
                : !themeSettings.navLinksEnableStatus.home}>
              <a class="nav-link" title={$_("nav-links.homepage")} href="/">
                {$_("nav-links.homepage")}
              </a>
            </li>
            <li
              class="nav-item"
              hidden={typeof themeSettings.navLinksEnableStatus?.support ===
              "undefined"
                ? false
                : !themeSettings.navLinksEnableStatus.support}>
              <a
                href="/support"
                class="nav-link"
                title={$_("nav-links.support")}>
                {$_("nav-links.support")}</a>
            </li>
            <li
              class="nav-item"
              hidden={!$session.siteInfo.registerAgreement  || (typeof themeSettings.navLinksEnableStatus?.rules ===
              "undefined"
                ? false
                : !themeSettings.navLinksEnableStatus.rules)}>
              <a
                href="/rules"
                class="nav-link"
                title={$_("nav-links.rules")}>
                {$_("nav-links.rules")}</a>
            </li>
          </ul>
        </div>
      {/if}
    </div>
  </nav>
</div>

<!-- Navbar End -->
<script>
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";

  import { page } from "$app/stores";
  import { PANEL_URL } from "$lib/variables.js";

  import { logout, notificationsCount } from "$lib/Store";

  const session = getContext("session");
  const themeSettings = getContext("themeSettings");

  $: navbarWidthOption = themeSettings.navbarWidthOption || "BY_CONTENT";

  function matching(path, pathName, startsWith = false) {
    return (
      path.toUpperCase() === pathName.toUpperCase() ||
      path.toUpperCase() === (pathName + "/").toUpperCase() ||
      (startsWith && path.startsWith(pathName))
    );
  }
</script>
