import { writable } from "svelte/store";

import { sendLogout } from "$lib/services/auth.js";
import { invalidateAll } from "$app/navigation";
import { redirect } from "@sveltejs/kit";
import { show as showToast } from "$lib/component/ToastContainer.svelte";

export const notificationsCount = writable(0);
export const quickNotifications = writable([]);

export const initialized = writable(false);

export async function logout() {
  sendLogout().then(async () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('pano_demo_bubble_shown');
    }
    await showToast("toasts.session-logged-out-successful");
    await invalidateAll();
  });
}

export function requireLogin(session, goto = "/login") {
  if (!session.user) {
    throw redirect(302, goto);
  }
}

export function requireNotLogin(session) {
  if (session.user) {
    throw redirect(302, "/");
  }
}
