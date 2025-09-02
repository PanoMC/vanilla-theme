<div class="col-lg-4 col-md-6 m-auto">
  <div class="card">
    <div class="card-body">
      <h3 class="card-title">{$_("pages.renew-password.title")}</h3>
      <ErrorAlert error="{error}" />
      <SuccessAlert message="{message}" />
      <form on:submit|preventDefault="{onSubmit}">
        <div class="mb-3">
          <label for="newPassword">{$_("pages.renew-password.inputs.new-password")}</label>
          <input
            type="password"
            id="newPassword"
            class="form-control"
            bind:value="{newPassword}" />
        </div>
        <div class="mb-3">
          <label for="newPasswordRepeat">{$_("pages.renew-password.inputs.new-password-repeat")}</label>
          <input
            type="password"
            id="newPasswordRepeat"
            class="form-control"
            bind:value="{newPasswordRepeat}" />
        </div>
        <button
          type="submit"
          class="btn btn-secondary w-100"
          class:disabled="{loading}">
          {$_("pages.renew-password.change-password-button")}
        </button>
      </form>
    </div>
  </div>
</div>

<script context="module">
  /**
   * @type {import('@sveltejs/kit').PageLoad}
   */
  export async function load({ parent, url: { searchParams } }) {
    await parent();

    const token = searchParams.get("token") || "";

    return { token };
  }
</script>

<script>
  import { _ } from "svelte-i18n";
  import ErrorAlert from "$lib/component/ErrorAlert.svelte";
  import SuccessAlert from "$lib/component/SuccessAlert.svelte";
  import { sendRenewPassword } from "$lib/services/auth.js";
  import { NETWORK_ERROR } from "$lib/api.util";

  export let data;
  let error;
  let message;
  let loading;
  let newPassword = "";
  let newPasswordRepeat = "";

  async function onSubmit() {
    error = null;
    message = null;
    loading = true;

    await sendRenewPassword(newPassword, newPasswordRepeat, data.token)
      .then((body) => {
        loading = false;

        if (body.result === "ok") {
          message = "RENEW_PASSWORD_SUCCESSFUL";

          return;
        }

        error = body.error;
      })
      .catch(() => {
        error = NETWORK_ERROR;
        loading = false;
      });
  }
</script>
