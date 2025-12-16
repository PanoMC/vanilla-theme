<div class="col-lg-4 col-md-6 m-auto">
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">{$_("pages.renew-password.title")}</h5>
      <ErrorAlert error={$error} />
      <SuccessAlert message={$message} />
      <form
        on:submit|preventDefault={() =>
          onSubmit(
            error,
            message,
            loading,
            newPassword,
            newPasswordRepeat,
            data,
          )}>
        <div class="vstack gap-3">
          <div class="input-group">
            <div class="form-floating">
              <input
                type="password"
                id="newPassword"
                class="form-control"
                bind:value={$newPassword} />
              <label for="newPassword"
                >{$_("pages.renew-password.inputs.new-password")}</label>
            </div>
            <div class="form-floating">
              <input
                type="password"
                id="newPasswordRepeat"
                class="form-control"
                bind:value={$newPasswordRepeat} />
              <label for="newPasswordRepeat"
                >{$_("pages.renew-password.inputs.new-password-repeat")}</label>
            </div>
          </div>
          <button
            type="submit"
            class="btn btn-lg btn-secondary w-100"
            class:disabled={$loading}>
            {$_("buttons.change-password")}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

<script context="module">
  import { processLoad } from "$lib/ui-logics/page-logics/RenewPasswordPageLogics";

  /**
   * @type {import('@sveltejs/kit').PageLoad}
   */
  export async function load(event) {
    return await processLoad(event);
  }
</script>

<script>
  import { _ } from "svelte-i18n";
  import { writable } from "svelte/store";

  import { onSubmit } from "$lib/ui-logics/page-logics/RenewPasswordPageLogics";

  import ErrorAlert from "$lib/component/ErrorAlert.svelte";
  import SuccessAlert from "$lib/component/SuccessAlert.svelte";

  export let data;

  let error = writable();
  let message = writable();
  let loading = writable();
  let newPassword = writable("");
  let newPasswordRepeat = writable("");
</script>
