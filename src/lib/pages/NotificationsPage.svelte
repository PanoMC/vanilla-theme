<div class="container">
  <!-- Action Menu -->
  <div
    class="row justify-content-end mb-3 animate__animated animate__slideInUp">
    {#if $notifications.length !== 0}
      <div class="col-auto">
        <button
          type="button"
          class="btn btn-danger"
          on:click="{() => onDeleteAllClick()}"
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
                checkTime,
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
            on:click="{deleteNotification(notification.id)}">
          </button>
        </div>
      {/each}

      {#if $notifications.length === 0}
        <NoContent />
      {/if}

      {#if $notifications.length < $count && $count > 10 + 10 * page}
        <div class="mt-3">
          <button
            class="btn btn-link bg-light d-block m-auto"
            class:disabled="{loadMoreLoading}"
            on:click="{loadMore}"
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
  import { get, writable } from "svelte/store";

  import { browser } from "$app/environment";

  import ApiUtil from "$lib/api.util.js";
  import { requireLogin } from "$lib/Store.js";

  const notifications = writable([]);
  const count = writable(0);

  Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);

    return this;
  };

  Array.prototype.remove = function (index) {
    this.splice(index, 1);

    return this;
  };

  function setNotifications(newNotifications) {
    if (get(notifications).length === 0 || newNotifications.length === 0)
      notifications.set(newNotifications);
    else {
      const listOfFilterIsNotificationExists = [];

      newNotifications.forEach((item, index) => {
        listOfFilterIsNotificationExists[index] = get(notifications).filter(
          (filterItem) => filterItem.id === item.id,
        );
      });

      newNotifications.forEach((item, index) => {
        if (listOfFilterIsNotificationExists[index].length === 0) {
          notifications.set(get(notifications).insert(index, item));
        }
      });
    }
  }

  async function loadData({ request }) {
    return new Promise((resolve, reject) => {
      ApiUtil.get({
        path: "/api/notifications",
        request,
      }).then((body) => {
        if (body.result === "ok") {
          resolve(body);
        } else {
          reject(body);
        }
      });
    });
  }

  /**
   * @type {import('@sveltejs/kit').PageLoad}
   */
  export async function load(event) {
    const { parent } = event;
    const parentData = await parent();

    const { session } = parentData;

    requireLogin(session);

    let data = {};

    // if (event.stuff.NETWORK_ERROR) {
    //   output.props.data.NETWORK_ERROR = true;
    //
    //   return output;
    // }

    await loadData({ request: event }).then((body) => {
      setNotifications(body.notifications);

      count.set(parseInt(body.notificationCount));
    });

    return data;
  }
</script>

<script>
  import { onDestroy, onMount } from "svelte";
  import { formatDistanceToNow } from "date-fns";
  import { _ } from "svelte-i18n";
  import * as locales from "date-fns/locale";

  import tooltip from "$lib/tooltip.util.js";

  import ConfirmRemoveAllNotificationsModal, {
    show as showDeleteAllNotificationsModal,
    setCallback as setDeleteAllNotificationsModalCallback,
  } from "$lib/component/modals/ConfirmRemoveAllNotificationsModal.svelte";
  import { onNotificationClick } from "$lib/NotificationManager.js";
  import NoContent from "$lib/component/NoContent.svelte";
  import { currentLanguage } from "$lib/language.util.js";

  export let data;

  let notificationProcessID = 0;
  let page = 0;
  let loadMoreLoading = false;

  let checkTime = 0;
  let interval;

  function getNotifications(id) {
    loadData({}).then((data) => {
      if (notificationProcessID === id) {
        if (data.result === "ok") {
          setNotifications(data.notifications);

          count.set(parseInt(data.notificationCount));
        }

        setTimeout(() => {
          if (notificationProcessID === id) {
            startNotificationsCountdown();
          }
        }, 1000);
      }
    });
  }

  function loadMore() {
    loadMoreLoading = true;

    ApiUtil.get({
      path: `/api/notifications/${
        get(notifications)[get(notifications).length - 1].id
      }/more`,
    }).then((body) => {
      if (body.result === "ok") {
        body.notifications.forEach((notification) => {
          notifications.update((value) =>
            value.insert(value.length, notification),
          );
        });

        loadMoreLoading = false;
      }
    });
  }

  function deleteNotification(id) {
    ApiUtil.delete({
      path: `/api/notifications/${id}`,
    }).then((body) => {
      if (body.result === "ok") {
        get(notifications).forEach((notification) => {
          if (notification.id === id) {
            notifications.update((value) =>
              value.remove(value.indexOf(notification)),
            );

            count.update((value) => value--);
          }
        });
      }
    });
  }

  function startNotificationsCountdown() {
    notificationProcessID++;

    const id = notificationProcessID;

    getNotifications(id);
  }

  function stopNotificationsCountdown() {
    notificationProcessID++;

    clearInterval(interval);
  }

  function getTime(check, time, locale) {
    return formatDistanceToNow(time, { addSuffix: true, locale });
  }

  function onDeleteAllClick() {
    stopNotificationsCountdown();

    showDeleteAllNotificationsModal();
  }

  if (browser) startNotificationsCountdown();

  onMount(() => {
    interval = setInterval(() => {
      checkTime += 1;
    }, 1000);
  });

  onDestroy(() => {
    stopNotificationsCountdown();
  });

  setDeleteAllNotificationsModalCallback(() => {
    startNotificationsCountdown();
  });
</script>
