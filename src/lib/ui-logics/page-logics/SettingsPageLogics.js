import { get, writable } from "svelte/store";

import { sendResetPassword } from "$lib/services/auth";
import { sendChangeEmail, sendUpdateProfile } from "$lib/services/profile";

import { NETWORK_ERROR } from "$lib/api.util";

import ProfileSidebar, { load as loadSidebar } from "$lib/component/sidebars/ProfileSidebar.svelte";
import { changeLanguage, getLanguageByLocale } from "$lib/language.util.js";

/**
 * @type {import("@sveltejs/kit").Load}
 */
export async function processLoad(event) {
  const { parent } = event;
  await parent();

  await loadSidebar(event);

  return { sidebar: ProfileSidebar };
}

export async function sendResetPasswordLink(
  resetPasswordError,
  resetPasswordLoading,
  resetPasswordSuccess,
  session
) {
  resetPasswordError.set(null);
  resetPasswordLoading.set(true);
  resetPasswordSuccess.set(false);

  await sendResetPassword(get(session).user.email)
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

  await sendUpdateProfile({localeCode: get(userLocale)}).then((body) => {
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
    saveButtonLoading
  };
}