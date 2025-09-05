<div class="col-lg-4 col-md-6 m-auto">
  <div class="card">
    <div class="card-body">
      <h3 class="card-title">{$_("pages.renew-password.title")}</h3>
      <ErrorAlert error="{$error}" />
      <SuccessAlert message="{$message}" />
      <form on:submit|preventDefault="{() => onSubmit(error, message, loading, newPassword, newPasswordRepeat, data)}">
        <div class="mb-3">
          <label for="newPassword">{$_("pages.renew-password.inputs.new-password")}</label>
          <input
            type="password"
            id="newPassword"
            class="form-control"
            bind:value="{$newPassword}" />
        </div>
        <div class="mb-3">
          <label for="newPasswordRepeat">{$_("pages.renew-password.inputs.new-password-repeat")}</label>
          <input
            type="password"
            id="newPasswordRepeat"
            class="form-control"
            bind:value="{$newPasswordRepeat}" />
        </div>
        <button
          type="submit"
          class="btn btn-secondary w-100"
          class:disabled="{$loading}">
          {$_("buttons.change-password")}
        </button>
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
