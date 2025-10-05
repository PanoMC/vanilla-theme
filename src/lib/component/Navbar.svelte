<!-- Navbar -->
<div class:container={themeSettings.navbarWidthOption !== "FULL_SIZE"}>
  <nav
    class="navbar navbar-expand-lg navbar-dark bg-cake bg-gradient border rounded rounded-{themeSettings.navRoundLevel
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
              class="btn btn-secondary rounded-pill"
              href={PANEL_URL}
              target="_blank"
              rel="noreferrer">
              <i class="fa-solid fa-up-right-from-square me-1"></i>
              {$_("nav-links.panel")}
            </a>
          </li>
        {/if}

        <!-- Notifications Dropdown -->
        <div
          class="nav-item position-relative"
          class:d-none={!$session.user}
          id="quickNotificationsDropdown">
          <button
            class="nav-link"
            data-bs-toggle="dropdown"
            href="javascript:void(0);"
            title={$_("navbar.notifications.title")}
            type="button">
            <i class="fa-regular fa-bolt"></i>
            {#if $notificationsCount !== 0}
              <span
                class="position-absolute px-2 py-1 translate-middle badge rounded-pill bg-danger">
                {$notificationsCount}
              </span>
            {/if}
          </button>
          <div
            class="dropdown-menu dropdown-menu-end position-absolute"
            style="width: 285px;">
            <h6 class="dropdown-header">
              {$_("navbar.notifications.title")}
              {$notificationsCount === 0 ? "" : "(" + $notificationsCount + ")"}
            </h6>

            {#if $quickNotifications.length === 0}
              <NoContent />
            {:else}
              <div class="list-group list-group-flush">
                {#each $quickNotifications as notification, index (notification)}
                  <button
                    class="list-group-item list-group-item-action"
                    type="button"
                    title={$_("buttons.view")}
                    on:click={() => onNotificationClick(notification)}
                    class:notification-unread={notification.status ===
                      "NOT_READ"}>
                    <div
                      class="d-flex align-item-start justify-content-start gap-3">
                      <span class="d-flex align-items-center">
                        {#if notification.details.faIcon}
                          <i
                            class="{notification.details
                              .faIcon} fa-lg fa-fw text-primary"></i>
                        {:else if notification.details.image || notification.details.username}
                          <img
                            src={notification.details.image ||
                              `https://minotar.net/avatar/${notification.details.username}/64`}
                            alt={$_("buttons.view")}
                            width="18"
                            height="18"
                            class="rounded-circle" />
                        {:else}
                          <i class="fa fa-bolt fa-lg fa-fw text-primary"></i>
                        {/if}
                      </span>

                      <div class="fw-normal">
                        <span class="text-wrap markdown-renderer text-break"
                          >{@html $_("notifications." + notification.type, {
                            values: {
                              ...sanitizeObject(notification.details || {}),
                            },
                          })}</span>
                        <br />
                        <small class="text-muted">
                          {getTime(
                            checkTime,
                            parseInt(notification.createdAt),
                            locales[$currentLanguage.dateFnsCode],
                          )}
                        </small>
                      </div>
                    </div>
                  </button>
                {/each}
              </div>
            {/if}

            <a class="dropdown-item bg-transparent" href="/notifications">
              <button class="btn btn-sm btn-primary w-100">
                {$_("buttons.show-all")}</button>
            </a>
          </div>
        </div>

        {#if $session.user}
          <!-- User Dropdown -->
          <li class="nav-item dropdown position-relative">
            <a
              href="/profile"
              class="nav-link"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              title={$session.user.username}>
              <img
                alt={$session.user.username}
                class="rounded d-block m-auto"
                src="https://minotar.net/avatar/{$session.user.username}"
                width="24"
                height="24" />
            </a>
            <ul class="dropdown-menu dropdown-menu-end position-absolute">
              <h6 class="dropdown-header">{$session.user.username}</h6>
              <li>
                <a
                  class:active={matching($page.url.pathname, "/profile")}
                  class="dropdown-item"
                  href="/profile">{$_("buttons.profile")}</a>
              </li>
              <li>
                <a
                  class:active={matching(
                    $page.url.pathname,
                    "/tickets",
                  )}
                  class="dropdown-item"
                  href="/tickets">{$_("buttons.tickets")}</a>
              </li>
              <li>
                <a
                  class:active={matching(
                    $page.url.pathname,
                    "/profile/settings",
                  )}
                  class="dropdown-item"
                  href="/profile/settings">{$_("buttons.settings")}</a>
              </li>
              <li>
                <button
                  type="button"
                  class="dropdown-item link-danger"
                  on:click={logout}>{$_("buttons.logout")}</button>
              </li>
            </ul>
          </li>
        {:else}
          <li class="nav-item me-xl-0 me-3">
            <button class="nav-link" on:click={showLoginModal}>
              {$_("buttons.login")}
            </button>
          </li>
          <li class="nav-item">
            <button
              type="button"
              class="btn btn-warning rounded-pill"
              on:click={showRegisterModal}>
              {$_("buttons.register")}
            </button>
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
          </ul>
        </div>
      {/if}
    </div>
  </nav>
</div>

<!-- Navbar End -->
<script>
  import { getContext, onDestroy, onMount } from "svelte";
  import { _ } from "svelte-i18n";

  import { sanitize } from "@jill64/universal-sanitizer";

  import { formatDistanceToNow } from "date-fns";
  import * as locales from "date-fns/locale";

  import { page } from "$app/stores";
  import { PANEL_URL } from "$lib/variables.js";

  import { notificationsCount, quickNotifications, logout } from "$lib/Store";
  import ApiUtil from "$lib/api.util.js";
  import { currentLanguage } from "$lib/language.util.js";
  import { onNotificationClick } from "$lib/NotificationManager.js";

  import NoContent from "$lib/component/NoContent.svelte";

  import { show as showLoginModal } from "$lib/component/modals/LoginModal.svelte";
  import { show as showRegisterModal } from "$lib/component/modals/RegisterModal.svelte";

  let quickNotificationProcessID = 0;

  let checkTime = 0;
  let interval, showingQuickNotification;

  const session = getContext("session");
  const themeSettings = getContext("themeSettings");

  $: navbarWidthOption = themeSettings.navbarWidthOption || "BY_CONTENT";

  function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  async function markQuickNotificationsAsRead(id) {
    await delay(1000);

    ApiUtil.post({
      path: "/api/notifications/quick/markAsRead",
    }).then((body) => {
      if (quickNotificationProcessID === id) {
        if (body.result === "ok") {
          notificationsCount.set(body.notificationCount);
        }

        setTimeout(() => {
          if (quickNotificationProcessID === id) {
            startMarkQuickNotificationsAsReadCountDown(id);
          }
        }, 1000);
      }
    });
  }

  function startMarkQuickNotificationsAsReadCountDown(id) {
    markQuickNotificationsAsRead(id);
  }

  function getTime(check, time, locale) {
    return formatDistanceToNow(time, { addSuffix: true, locale });
  }

  function scheduleReadForLast5(notifications) {
    if (!showingQuickNotification) return;

    notifications.slice(0, 5).forEach((notification) => {
      if (notification.status === "NOT_READ") {
        setTimeout(() => {
          if (!showingQuickNotification) return;

          quickNotifications.update((notifications) => {
            notifications.forEach((subNotification) => {
              if (subNotification.id === notification.id) {
                notification.status = "READ";
              }
            });

            return notifications;
          });
        }, 3000);
      }
    });
  }

  onDestroy(quickNotifications.subscribe(scheduleReadForLast5));

  onMount(() => {
    const dropdown = document.getElementById("quickNotificationsDropdown");

    dropdown.addEventListener("show.bs.dropdown", function () {
      quickNotificationProcessID++;

      const id = quickNotificationProcessID;

      startMarkQuickNotificationsAsReadCountDown(id);

      showingQuickNotification = true;

      scheduleReadForLast5($quickNotifications);
    });

    dropdown.addEventListener("hide.bs.dropdown", function () {
      quickNotificationProcessID++;

      showingQuickNotification = false;
    });

    interval = setInterval(() => {
      checkTime += 1;
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(interval);
  });

  function sanitizeObject(obj) {
    return Object.keys(obj).reduce((sanitizedObj, key) => {
      sanitizedObj[key] = sanitize(obj[key]);
      return sanitizedObj;
    }, {});
  }

  function matching(path, pathName, startsWith = false) {
    return (
      path.toUpperCase() === pathName.toUpperCase() ||
      path.toUpperCase() === (pathName + "/").toUpperCase() ||
      (startsWith && path.startsWith(pathName))
    );
  }
</script>
