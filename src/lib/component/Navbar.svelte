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
                class="btn btn-secondary rounded-pill"
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
            class="nav-item position-relative"
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
              class="dropdown-menu dropdown-menu-end"
              class:d-none={!$session.user}
              style="width: 300px;">
              <h6 class="dropdown-header">
                {$_("navbar.notifications.title")}
                {$notificationsCount === 0
                  ? ""
                  : "(" + $notificationsCount + ")"}
              </h6>

              {#if $quickNotifications.length === 0}
                <NoContent />
              {:else}
                <div class="list-group list-group-flush">
                  {#each $quickNotifications as notification, index (notification)}
                    <div
                      class="fw-normal list-group-item list-group-item-action d-flex align-items-center gap-3 text-wrap"
                      class:notification-unread={notification.status ===
                        "NOT_READ"}>
                      <button
                        type="button"
                        title={$_("buttons.view")}
                        on:click={() => onNotificationClick(notification)}
                        class="text-start border-0 bg-transparent p-0 d-flex align-items-center gap-3">
                        <span class="d-flex align-items-center">
                          {#if notification.details.faIcon}
                            <i class="{notification.details.faIcon} fa-fw"></i>
                          {:else if notification.details.image || notification.details.username}
                            <img
                              src={notification.details.image ||
                                `https://minotar.net/avatar/${notification.details.username}/64`}
                              alt={$_("buttons.view")}
                              width="48"
                              height="48"
                              class="rounded" />
                          {:else}
                            <i class="fa fa-fw fa-bolt"></i>
                          {/if}
                        </span>

                        <span class="text-start">
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
                        </span>
                      </button>
                    </div>
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
  import { getContext, onDestroy, onMount } from "svelte";
  import { _ } from "svelte-i18n";

  import { sanitize } from "@jill64/universal-sanitizer";

  import { formatDistanceToNow } from "date-fns";
  import * as locales from "date-fns/locale";

  import { PANEL_URL } from "$lib/variables.js";
  import { notificationsCount, quickNotifications } from "$lib/Store";
  import ApiUtil from "$lib/api.util.js";
  import { currentLanguage } from "$lib/language.util.js";
  import { onNotificationClick } from "$lib/NotificationManager.js";

  import NoContent from "$lib/component/NoContent.svelte";

  import { show as showLoginModal } from "$lib/component/modals/LoginModal.svelte";
  import { show as showRegisterModal } from "$lib/component/modals/RegisterModal.svelte";

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

  function sanitizeObject(obj) {
    return Object.keys(obj).reduce((sanitizedObj, key) => {
      sanitizedObj[key] = sanitize(obj[key]);
      return sanitizedObj;
    }, {});
  }
</script>
