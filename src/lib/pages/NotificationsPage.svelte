<div class="container">
  <!-- Action Menu -->
  <div
    class="row justify-content-end mb-3 animate__animated animate__slideInUp">
    {#if $notifications.length !== 0}
      <div class="col-auto">
        <button
          type="button"
          class="btn btn-danger"
          on:click="{() => onDeleteAllClick(notificationProcessID, interval)}"
          >{$_("pages.notifications.delete-all-button")}
        </button>
      </div>
    {/if}
  </div>

  <!-- All Notifications -->

  <div class="card">
    <div class="card-body">
      <h3 class="card-title">
        {$_("navbar.notifications.title")}
      </h3>
      {#each $notifications as notification, index (notification)}
        <div class="list-group list-group-flush">
          <a
            href="javascript:void(0);"
            on:click="{() => onNotificationClick(notification)}"
            class="list-group-item list-group-item-action"
            class:notification-unread="{notification.status === 'NOT_READ'}">
            <span class="text-wrap">{notification.type}</span>
            <br />
            <small class="text-muted">
              {getTime(
                $checkTime,
                parseInt(notification.date),
                locales[$currentLanguage.dateFnsCode],
              )}
            </small>
          </a>
          <button
            class="btn-close btn-sm mx-2"
            use:tooltip="{[
              $_('pages.notifications.delete-notification'),
              { placement: 'right' },
            ]}"
            on:click="{() => deleteNotification(notifications, count, notification.id)}">
          </button>
        </div>
      {/each}

      {#if $notifications.length === 0}
        <NoContent />
      {/if}

      {#if $notifications.length < $count && $count > 10 + 10 * $page}
        <div class="mt-3">
          <button
            class="btn btn-link bg-light d-block m-auto"
            class:disabled="{$loadMoreLoading}"
            on:click="{() => loadMore(notifications, loadMoreLoading)}"
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
    deleteNotification,
    getTime,
    init, loadMore,
    onDeleteAllClick
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
    interval
  } = init(data);
</script>
