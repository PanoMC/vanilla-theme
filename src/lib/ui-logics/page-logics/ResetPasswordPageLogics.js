import { get } from "svelte/store";

import { NETWORK_ERROR } from "$lib/api.util";
import { sendResetPassword } from "$lib/services/auth";
import { requireNotLogin } from "$lib/Store";

export async function processLoad({ parent }) {
  const parentData = await parent();

  const { session } = parentData;

  requireNotLogin(session);
}

export async function onSubmit(error, message, loading, usernameOrEmail) {
  error.set(null);
  message.set(null);
  loading.set(true);

  await sendResetPassword(get(usernameOrEmail))
    .then((body) => {
      loading.set(false);

      if (body.result === "ok") {
        message.set("RESET_PASSWORD_SUCCESSFUL");

        return;
      }

      if (body.error === "NOT_EXISTS") {
        message.set("RESET_PASSWORD_SUCCESSFUL");

        return;
      }

      error.set(body.error);
    })
    .catch(() => {
      error.set(NETWORK_ERROR);
      loading.set(false);
    });
}