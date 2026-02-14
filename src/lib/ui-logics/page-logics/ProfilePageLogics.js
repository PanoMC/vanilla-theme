import { getProfile } from "$lib/services/profile";
import { getTickets } from "$lib/services/tickets";
import ApiUtil from "$lib/api.util";

import ProfileSidebar, { load as loadSidebar } from "$lib/components/sidebars/ProfileSidebar.svelte";

export const PageTypes = Object.freeze({
  ALL: "ALL",
  CLOSED: "CLOSED"
});

export const DefaultPageType = PageTypes.ALL;

/**
 * @type {import("@sveltejs/kit").Load}
 */
export async function processLoad(event) {
  const { parent } = event;
  await parent();

  const searchParams = event.url.searchParams;
  const page = parseInt(searchParams.get("page")) || 1;
  const pageType = searchParams.get("pageType") || DefaultPageType;
  const notificationsPageNumber = parseInt(searchParams.get("notificationsPage")) || 1;

  await loadSidebar(event);

  const [profileBody, ticketsBody, sessionsBody, notificationsBody] = await Promise.all([
    getProfile({ request: event }),
    getTickets({
      page,
      pageType,
      request: event
    }),
    ApiUtil.get({
      path: '/api/profile/sessions',
      request: event,
    }),
    ApiUtil.get({
      path: `/api/notifications?page=${notificationsPageNumber}`,
      request: event,
    })
  ]);

  const sessions = !sessionsBody.error ? sessionsBody.sessions : [];

  return {
    ...profileBody,
    ticketsData: ticketsBody,
    sessions,
    notificationsData: {
      notifications: notificationsBody.notifications || [],
      notificationCount: parseInt(notificationsBody.notificationCount || 0),
      page: notificationsPageNumber,
      totalPage: Math.ceil(parseInt(notificationsBody.notificationCount || 0) / 10)
    },
    pageType,
    sidebar: ProfileSidebar
  };
}