import { get } from "svelte/store";

import { sendRenewPassword } from "$lib/services/auth";
import { NETWORK_ERROR } from "$lib/api.util";

export async function processLoad({ parent, url: { searchParams } }) {
  await parent();

  const token = searchParams.get("token") || "";

  return { token };
}

export async function onSubmit(error, message, loading, newPassword, newPasswordRepeat, data) {
  error.set(null);
  message.set(null);
  loading.set(true);

  await sendRenewPassword(get(newPassword), get(newPasswordRepeat), data.token)
    .then((body) => {
      loading.set(false);

      if (body.result === "ok") {
        message.set("RENEW_PASSWORD_SUCCESSFUL");

        return;
      }

      error.set(body.error);
    })
    .catch(() => {
      error.set(NETWORK_ERROR);
      loading.set(false);
    });
}