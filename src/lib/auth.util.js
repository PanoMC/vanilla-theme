import { page } from "$app/state";

export const Permissions = Object.freeze({
  ACCESS_PANEL: "ACCESS_PANEL",
  MANAGE_SERVERS: "MANAGE_SERVERS",
  MANAGE_POSTS: "MANAGE_POSTS",
  MANAGE_TICKETS: "MANAGE_TICKETS",
  MANAGE_PLAYERS: "MANAGE_PLAYERS",
  MANAGE_VIEW: "MANAGE_VIEW",
  MANAGE_ADDONS: "MANAGE_ADDONS",
  MANAGE_PLATFORM_SETTINGS: "MANAGE_PLATFORM_SETTINGS",
  MANAGE_PERMISSION_GROUPS: "MANAGE_PERMISSION_GROUPS",
  ACCESS_ACTIVITY_LOGS: "ACCESS_ACTIVITY_LOGS",
  MANAGE_TRANSLATIONS: "MANAGE_TRANSLATIONS"
});

export function hasPermission(permission, user) {
  if (!user) {
    const { session } = page.data;

    user = session?.user;
  }

  const userObject = user;

  if (userObject?.admin) {
    return true;
  }

  if (!userObject?.permissions) {
    return false;
  }

  return userObject.permissions.includes(permission.toUpperCase());
}
