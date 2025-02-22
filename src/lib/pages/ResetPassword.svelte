<div class="col-lg-4 col-md-6 m-auto">
  <div class="card">
    <div class="card-body">
      <h3 class="card-title">{$_("pages.reset-password.title")}</h3>
      <ErrorAlert error="{error}" />
      <SuccessAlert message="{message}" />
      <form on:submit|preventDefault="{onSubmit}">
        <p>
          {$_("pages.reset-password.description")}
        </p>

        <div class="mb-3">
          <div class="form-group">
            <input
              type="text"
              placeholder="{$_('pages.reset-password.inputs.email-username.placeholder')}"
              id="email"
              class="form-control"
              bind:value="{usernameOrEmail}" />
          </div>
        </div>
        <button
          type="submit"
          class="btn btn-primary w-100"
          class:disabled="{loading}">
          {$_("pages.reset-password.reset-password-button")}
        </button>
      </form>
    </div>
  </div>
</div>

<script context="module">
  import { requireNotLogin } from "$lib/Store.js";

  /**
   * @type {import('@sveltejs/kit').LayoutLoad}
   */
  export async function load({ parent }) {
    const parentData = await parent();

    const { session } = parentData;

    requireNotLogin(session);
  }
</script>

<script>
  import ErrorAlert from "$lib/component/ErrorAlert.svelte";
  import SuccessAlert from "$lib/component/SuccessAlert.svelte";
  import { sendResetPassword } from "$lib/services/auth.js";
  import { NETWORK_ERROR } from "$lib/api.util.js";
  import { _ } from "svelte-i18n";

  let error;
  let message;
  let loading;
  let usernameOrEmail = "";

  async function onSubmit() {
    error = null;
    message = null;
    loading = true;

    await sendResetPassword(usernameOrEmail)
      .then((body) => {
        loading = false;

        if (body.result === "ok") {
          message = "RESET_PASSWORD_SUCCESSFUL";

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
