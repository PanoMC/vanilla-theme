<!-- Navbar -->
<style>
  @media (max-width: 991.98px) {
    .rounded-pill {
      border-radius: 0.3rem !important;
    }
  }
</style>

<div class="py-3">
  <div class="container">
    <nav
      class="navbar navbar-expand-lg navbar-dark bg-primary bg-body-primary bg-gradient rounded-pill shadow">
      <div class="container">
        <ul class="navbar-nav flex-row me-auto">
          <button
            class="navbar-toggler d-lg-none"
            data-bs-target="#navbar"
            data-bs-toggle="collapse"
            type="button">
            <i aria-hidden="true" class="fa fa-bars"></i>
          </button>
        </ul>

        <ul class="navbar-nav flex-row ml-auto order-lg-last">
          {#if $session.user && $session.user.panelAccess}
            <li class="nav-item">
              <a
                class="nav-link"
                href={PANEL_URL}
                target="_blank"
                rel="noreferrer">
                <i class="fa-solid fa-table-columns fa-rotate-by me-1"></i>
                {$_("nav-links.panel")}
              </a>
            </li>
          {/if}

          <!-- Notifications Dropdown -->
          <div
            class="nav-item mx-lg-0 mx-3"
            id="quickNotificationsDropdown"
            class:d-none={!$session.user}>
            <div class="dropdown">
              <button
                class="nav-link"
                data-bs-toggle="dropdown"
                type="button"
                title={$_("navbar.notifications.title")}>
                <i class="fas fa-bolt"></i>

                {#if $notificationsCount !== 0}
                  <span
                    class="position-absolute px-2 py-1 translate-middle badge rounded-pill bg-danger">
                    {$notificationsCount}
                  </span>
                {/if}
              </button>
              <div class="dropdown-menu dropdown-menu-end position-absolute">
                <h6 class="dropdown-header">
                  {$_("navbar.notifications.title")}
                  {$notificationsCount === 0
                    ? ""
                    : "(" + $notificationsCount + ")"}
                </h6>

                {#if $quickNotifications.length === 0}
                  <NoContent />
                {:else}
                  {#each $quickNotifications as notification, index (notification)}
                    <button
                      type="button"
                      on:click={() => onNotificationClick(notification)}
                      class="dropdown-item"
                      class:notification-unread={notification.status ===
                        "NOT_READ"}>
                      <p class="mb-0">{notification.type}</p>
                      <small class="text-dark">
                        {getTime(
                          checkTime,
                          parseInt(notification.date),
                          locales[$currentLanguage["date-fns-code"]],
                        )}
                      </small>
                    </button>
                  {/each}
                {/if}

                <li class="dropdown-item bg-transparent">
                  <a href="/notifications" class="btn btn-sm btn-primary w-100"
                    >{$_("navbar.notifications.show-all")}</a>
                </li>
              </div>
            </div>
          </div>

          {#if $session.user}
            <!-- User Dropdown -->
            <li class="nav-item mr-lg-0 mr-5">
              <a
                href="/profile"
                class="nav-link"
                title={$session.user.username}>
                <img
                  alt={$session.user.username}
                  class="rounded d-block m-auto"
                  src="https://minotar.net/avatar/{$session.user.username}"
                  width="24"
                  height="24" />
              </a>
            </li>
          {:else}
            <li class="nav-item me-xl-0 me-3">
              <button class="nav-link" on:click={showLoginModal}>
                {$_("navbar.login-button")}
              </button>
            </li>
            <li class="nav-item">
              <button
                type="button"
                class="btn btn-warning rounded-pill"
                on:click={showRegisterModal}>
                {$_("navbar.register-button")}
              </button>
            </li>
          {/if}
        </ul>

        <div class="collapse navbar-collapse" id="navbar">
          <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
            <li class="nav-item">
              <a class="nav-link" title={$_("nav-links.homepage")} href="/">
                {$_("nav-links.homepage")}
              </a>
            </li>
            <li class="nav-item">
              <a
                href="/support"
                class="nav-link"
                title={$_("nav-links.support")}>
                {$_("nav-links.support")}</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</div>

<!-- Navbar End -->
<script>
  import { formatDistanceToNow } from "date-fns";
  import { getContext, onDestroy, onMount } from "svelte";
  import { _ } from "svelte-i18n";

  import { PANEL_URL } from "$lib/variables.js";
  import { notificationsCount, quickNotifications } from "$lib/Store";
  import ApiUtil from "$lib/api.util.js";
  import { onNotificationClick } from "$lib/NotificationManager.js";

  import NoContent from "$lib/component/NoContent.svelte";

  import { show as showLoginModal } from "./modals/LoginModal.svelte";
  import { show as showRegisterModal } from "./modals/RegisterModal.svelte";
  import * as locales from "date-fns/locale";
  import { currentLanguage } from "$lib/language.util.js";

  let quickNotificationProcessID = 0;

  let checkTime = 0;
  let interval;

  const session = getContext("session");

  function markQuickNotificationsAsRead(id) {
    ApiUtil.post({
      path: "/api/notifications/quick/markAsRead",
    }).then((body) => {
      if (quickNotificationProcessID === id) {
        if (body.result === "ok") {
          notificationsCount.set(body.notificationCount);
        }

        setTimeout(() => {
          if (quickNotificationProcessID === id) {
            startMarkQuickNotificationsAsReadCountDown();
          }
        }, 1000);
      }
    });
  }

  function startMarkQuickNotificationsAsReadCountDown() {
    quickNotificationProcessID++;

    const id = quickNotificationProcessID;

    if ($quickNotifications.length > 0) {
      markQuickNotificationsAsRead(id);
    } else {
      setTimeout(() => {
        if (quickNotificationProcessID === id) {
          startMarkQuickNotificationsAsReadCountDown();
        }
      }, 1000);
    }
  }

  function getTime(check, time, locale) {
    return formatDistanceToNow(time, { addSuffix: true, locale });
  }

  onMount(() => {
    const dropdown = document.getElementById("quickNotificationsDropdown");

    dropdown.addEventListener("show.bs.dropdown", function () {
      startMarkQuickNotificationsAsReadCountDown();
    });

    dropdown.addEventListener("hide.bs.dropdown", function () {
      quickNotificationProcessID++;
    });

    interval = setInterval(() => {
      checkTime += 1;
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>
