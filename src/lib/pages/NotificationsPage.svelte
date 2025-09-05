<div class="container">
  <!-- Action Menu -->
  <div
    class="row justify-content-end mb-3 animate__animated animate__slideInUp">
    {#if $notifications.length !== 0}
      <div class="col-auto">
        <button
          type="button"
          class="btn btn-danger"
          on:click={() => onDeleteAllClick(notificationProcessID, interval)}
        >{$_("buttons.delete-all")}
        </button>
      </div>
    {/if}
  </div>

  <!-- All Notifications -->

  <div class="card">
    <div class="card-header">
      {$_("navbar.notifications.title")}
    </div>
    <div class="card-body">
      <div class="list-group" class:d-none={$notifications.length === 0}>
        {#each $notifications as notification, index (notification)}
          <div
            class="fw-normal list-group-item list-group-item-action d-flex align-items-center gap-3 text-wrap"
            class:notification-unread={notification.status === "NOT_READ"}>
            <button
              type="button"
              title={$_("buttons.view")}
              on:click={() => onNotificationClick(notification)}
              class="flex-grow-1 text-start border-0 bg-transparent p-0 d-flex align-items-center gap-3">
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

              <span class="flex-grow-1 text-start">
                <span class="text-wrap markdown-renderer"
                  >{@html $_("notifications." + notification.type, {
                    values: { ...sanitizeObject(notification.details || {}) },
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

            <button
              type="button"
              class="btn-close ms-2"
              aria-label={$_("pages.notifications.delete-notification")}
              use:tooltip={[
                $_("pages.notifications.delete-notification"),
                { placement: "bottom" },
              ]}
              on:click={() => onDeleteNotificationClick(notification.id)}>
            </button>
          </div>
        {/each}
      </div>

      {#if $notifications.length === 0}
        <NoContent />
      {/if}

      {#if $notifications.length < $count && $count > 10 + 10 * $page}
        <div class="mt-3">
          <button
            class="btn btn-link bg-light d-block m-auto"
            class:disabled={$loadMoreLoading}
            on:click={() => loadMore(notifications, loadMoreLoading)}
            >{$_("pages.notifications.show-more", {
              values: { count: $count - $notifications.length },
            })}
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>

<ConfirmRemoveAllNotificationsModal />

<script context="module">
  import { processLoad } from "$lib/ui-logics/page-logics/NotificationsPageLogics";

  /**
   * @type {import('@sveltejs/kit').PageLoad}
   */
  export async function load(event) {
    return processLoad(event);
  }
</script>

<script>
  import { _ } from "svelte-i18n";
  import * as locales from "date-fns/locale";

  import tooltip from "$lib/tooltip.util.js";

  import { onNotificationClick } from "$lib/NotificationManager";
  import { currentLanguage } from "$lib/language.util";

  import {
    onDeleteNotificationClick,
    getTime,
    init,
    loadMore,
    onDeleteAllClick,
    sanitizeObject,
  } from "$lib/ui-logics/page-logics/NotificationsPageLogics";

  import ConfirmRemoveAllNotificationsModal from "$lib/component/modals/ConfirmRemoveAllNotificationsModal.svelte";
  import NoContent from "$lib/component/NoContent.svelte";

  export let data;

  const {
    notifications,
    count,
    notificationProcessID,
    page,
    loadMoreLoading,
    checkTime,
    interval,
  } = init(data);
</script>
