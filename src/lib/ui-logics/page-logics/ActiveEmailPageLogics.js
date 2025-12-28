import { sendVerifyEmail } from "$lib/services/auth";

import { NETWORK_ERROR } from "$lib/api.util";

/**
 * @type {import("@sveltejs/kit").Load}
 */
export async function processLoad({ parent, url: { searchParams } }) {
  await parent();

  const token = searchParams.get("token") || "";

  return { token };
}

export async function verifyEmail(error, successMessage, loading, data) {
  error.set(null);
  successMessage.set(null);
  loading.set(true);

  await sendVerifyEmail(data.token)
    .then((body) => {
      loading.set(false);

      if (body.result === "ok") {
        successMessage.set("VALIDATION_SUCCESSFUL");
      } else {
        error.set(body.error);
      }
    })
    .catch(() => {
      loading.set(false);

      error.set(NETWORK_ERROR);
    });
}