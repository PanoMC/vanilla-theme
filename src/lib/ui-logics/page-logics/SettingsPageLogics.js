import { get, writable } from "svelte/store";

import { sendChangeEmail, sendResetPassword, sendUpdateProfile } from "$lib/services/profile";

import ApiUtil, { NETWORK_ERROR } from "$lib/api.util";
import { executeLifecycle, executeViewLoad, panoApiServer } from "$lib/PluginAPI";

import ProfileSidebar, { load as loadSidebar } from "$lib/components/sidebars/ProfileSidebar.svelte";
import { changeLanguage, getLanguageByLocale } from "$lib/language.util.js";

/**
 * @type {import("@sveltejs/kit").Load}
 */
export async function processLoad(event) {
  const { parent } = event;
  await parent();

  // Initialize settings content
  panoApiServer.ui.settings.content.edit((items) => {
    items.push({ id: "settings-cards", priority: 100, hidden: false });
  });

  // Initialize settings card rows
  panoApiServer.ui.settings.cardRows.edit((items) => {
    items.push(
      { id: "change-password", priority: 100, hidden: false },
      { id: "change-email", priority: 90, hidden: false },
      { id: "display-language", priority: 80, hidden: false },
    );
  });

  await executeLifecycle("theme:settings:load", {}, event);

  // View loads, sidebar, and sessions API call are all independent — run in parallel
  const [, , , sessionsBody] = await Promise.all([
    executeViewLoad("settings-content", event),
    executeViewLoad("settings-card-rows", event),
    loadSidebar(event),
    ApiUtil.get({ path: "/api/profile/sessions", request: event })
  ]);

  const sessions = !sessionsBody.error ? sessionsBody.sessions : [];

  return { sidebar: ProfileSidebar, sessions, pageTitle: "pages.settings.title" };
}

export async function sendResetPasswordLink(
  resetPasswordError,
  resetPasswordLoading,
  resetPasswordSuccess,
) {
  resetPasswordError.set(null);
  resetPasswordLoading.set(true);
  resetPasswordSuccess.set(false);

  await sendResetPassword()
    .then((body) => {
      resetPasswordLoading.set(false);

      if (body.result === "ok") {
        resetPasswordSuccess.set(true);

        return;
      }

      resetPasswordError.set(body.error || NETWORK_ERROR);
    })
    .catch(() => {
      resetPasswordLoading.set(false);
      resetPasswordError.set(NETWORK_ERROR);
    });
}

export async function sendChangeEmailLink(
  changingEmailError,
  changingEmailLoading,
  changingEmailSuccess,
  currentPassword,
  newEmail,
  changingEmail,
  changingEmail2ndStep
) {
  changingEmailError.set(null);
  changingEmailLoading.set(true);
  changingEmailSuccess.set(false);

  await sendChangeEmail(get(currentPassword), get(newEmail))
    .then((body) => {
      changingEmailLoading.set(false);

      if (body.result === "ok") {
        changingEmail.set(false);
        changingEmail2ndStep.set(false);

        changingEmailSuccess.set(true);

        return;
      }

      changingEmailError.set(body.error || NETWORK_ERROR);
    })
    .catch(() => {
      changingEmailLoading.set(false);

      changingEmailError.set(NETWORK_ERROR);
    });
}

export function startChangingEmail(changingEmail) {
  changingEmail.set(true);
}

export function startChangingEmail2ndStep(changingEmail2ndStep) {
  changingEmail2ndStep.set(true);
}

export function stopChangingEmail(currentPassword, newEmail, changingEmail) {
  currentPassword.set("");
  newEmail.set("");

  changingEmail.set(false);
}

export function stopChangingEmail2ndStep(changingEmail2ndStep) {
  changingEmail2ndStep.set(false);
}

export async function saveSettings(userLocale, saveButtonLoading) {
  saveButtonLoading.set(true)

  await sendUpdateProfile({ localeCode: get(userLocale) }).then((body) => {
    if (body.error) {
      location.reload();
      return;
    }

    changeLanguage(getLanguageByLocale(get(userLocale)))
    saveButtonLoading.set(false)
  }).catch(() => {
    location.reload();
  })
}

export async function onLogoutSession(sessionId, loadingSessionId, showToast, invalidateAll) {
  loadingSessionId.set(sessionId);

  ApiUtil.delete({
    path: `/api/profile/sessions/${sessionId}`,
    handler: async (body) => {
      loadingSessionId.set(null);

      if (body.error) {
        await showToast('errors.' + body.error);
        return;
      }

      await showToast('toasts.session-logged-out-successful');
      invalidateAll();
    },
  });
}

export function init(session) {
  const resetPasswordError = writable();
  const resetPasswordLoading = writable();
  const resetPasswordSuccess = writable();

  const currentPassword = writable();
  const newEmail = writable();

  const changingEmail = writable();
  const changingEmail2ndStep = writable();

  const changingEmailError = writable();
  const changingEmailLoading = writable();
  const changingEmailSuccess = writable();

  const userLocale = writable(session.siteInfo.locale)
  const saveButtonLoading = writable()
  const loadingSessionId = writable(null)

  return {
    resetPasswordError,
    resetPasswordLoading,
    resetPasswordSuccess,
    currentPassword,
    newEmail,
    changingEmail,
    changingEmail2ndStep,
    changingEmailError,
    changingEmailLoading,
    changingEmailSuccess,
    userLocale,
    saveButtonLoading,
    loadingSessionId
  };
}