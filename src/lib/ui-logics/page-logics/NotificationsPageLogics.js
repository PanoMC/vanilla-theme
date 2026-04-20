import { onDestroy, onMount } from "svelte";
import { get, writable } from "svelte/store";

import { formatDistanceToNow } from "date-fns";
import { sanitize } from "@jill64/universal-sanitizer";

import { browser } from "$app/environment";

import ApiUtil from "$lib/api.util.js";
import { requireLogin } from "$lib/Store.js";

import ProfileSidebar, { load as loadSidebar } from "$lib/components/sidebars/ProfileSidebar.svelte";

import {
  setCallback as setDeleteAllNotificationsModalCallback,
  show as showDeleteAllNotificationsModal
} from "$lib/components/modals/ConfirmRemoveAllNotificationsModal.svelte";

Array.prototype.insert = function(index, item) {
  this.splice(index, 0, item);

  return this;
};

Array.prototype.remove = function(index) {
  this.splice(index, 1);

  return this;
};

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function setNotifications(notifications, newNotifications) {
  if (get(notifications).length === 0 || newNotifications.length === 0)
    notifications.set(newNotifications);
  else {
    const listOfFilterIsNotificationExists = [];

    newNotifications.forEach((item, index) => {
      listOfFilterIsNotificationExists[index] = get(notifications).filter(
        (filterItem) => filterItem.id === item.id
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
      request
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
 * @type {import("@sveltejs/kit").PageLoad}
 */
export async function processLoad(event) {
  const { parent } = event;
  const parentData = await parent();

  const { session } = parentData;

  requireLogin(session);

  // if (event.stuff.NETWORK_ERROR) {
  //   output.props.data.NETWORK_ERROR = true;
  //
  //   return output;
  // }

  const [{ notifications, notificationCount }] = await Promise.all([
    loadData({ request: event }),
    loadSidebar(event)
  ]);

  return {
    notifications,
    notificationCount: parseInt(notificationCount),
    sidebar: ProfileSidebar,
    sidebarProps: { showDeleteAll: true },
    pageTitle: "pages.notifications.page-title"
  };
}

async function getNotifications(notifications, notificationProcessID, count, id) {
  await delay(1000);

  loadData({}).then((data) => {
    if (get(notificationProcessID) === id) {
      if (data.result === "ok") {
        setNotifications(notifications, data.notifications);

        count.set(parseInt(data.notificationCount));
      }

      setTimeout(() => {
        if (get(notificationProcessID) === id) {
          startNotificationsCountdown(notifications, notificationProcessID, count);
        }
      }, 1000);

      get(notifications).forEach(notification => {
        if (notification.status === "NOT_READ") {
          setTimeout(() => {
            notifications.update(notifications => {
              notifications.forEach(subNotification => {
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
  });
}

export function loadMore(notifications, loadMoreLoading) {
  loadMoreLoading.set(true);

  ApiUtil.get({
    path: `/api/notifications/${
      get(notifications)[get(notifications).length - 1].id
    }/more`
  }).then((body) => {
    if (body.result === "ok") {
      body.notifications.forEach((notification) => {
        notifications.update((value) =>
          value.insert(value.length, notification)
        );
      });

      loadMoreLoading.set(false);
    }
  });
}

export function onDeleteNotificationClick(notifications, count, id) {
  ApiUtil.delete({
    path: `/api/notifications/${id}`
  }).then((body) => {
    if (body.result === "ok") {

      get(notifications).forEach((notification) => {
        if (notification.id === id) {
          notifications.update((value) => {
              return value.remove(value.indexOf(notification));
            }
          );

          count.update((value) => {
            value--;

            return value;
          });
        }
      });
    }
  });
}

function startNotificationsCountdown(notifications, notificationProcessID, count) {
  notificationProcessID.update(notificationProcessID => {
    notificationProcessID++;
    return notificationProcessID;
  });

  const id = get(notificationProcessID);

  getNotifications(notifications, notificationProcessID, count, id);
}

function stopNotificationsCountdown(notificationProcessID, interval) {
  notificationProcessID.update(notificationProcessID => {
    notificationProcessID++;
    return notificationProcessID;
  });

  clearInterval(get(interval));
}

export function getTime(check, time, locale) {
  return formatDistanceToNow(time, { addSuffix: true, locale });
}

export function onDeleteAllClick(notificationProcessID, interval) {
  stopNotificationsCountdown(notificationProcessID, interval);

  showDeleteAllNotificationsModal();
}

export function init(data) {
  const notifications = writable(data.notifications || []);
  const count = writable(data.notificationCount || 0);
  const notificationProcessID = writable(0);
  const checkTime = writable(0);
  const interval = writable();

  const page = writable(0);
  const loadMoreLoading = writable(false);

  if (browser) startNotificationsCountdown(notifications, notificationProcessID, count);

  onMount(() => {
    interval.set(setInterval(() => {
      checkTime.update(checkTime => {
        checkTime += 1;
        return checkTime;
      });
    }, 1000));
  });

  onDestroy(() => {
    stopNotificationsCountdown(interval);
  });

  setDeleteAllNotificationsModalCallback(() => {
    startNotificationsCountdown(notifications, notificationProcessID, count);
  });

  return {
    notifications,
    count,
    notificationProcessID,
    page,
    loadMoreLoading,
    checkTime,
    interval
  };
}

export function sanitizeObject(obj) {
  return Object.keys(obj).reduce((sanitizedObj, key) => {
    sanitizedObj[key] = sanitize(obj[key]);
    return sanitizedObj;
  }, {});
}