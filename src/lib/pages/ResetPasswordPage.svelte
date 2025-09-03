<div class="col-lg-4 col-md-6 m-auto">
  <div class="card">
    <div class="card-body">
      <h3 class="card-title">{$_("pages.reset-password.title")}</h3>
      <ErrorAlert error="{$error}" />
      <SuccessAlert message="{$message}" />
      <form on:submit|preventDefault="{() => onSubmit(error, message, loading, usernameOrEmail)}">
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
              bind:value="{$usernameOrEmail}" />
          </div>
        </div>
        <button
          type="submit"
          class="btn btn-primary w-100"
          class:disabled="{$loading}">
          {$_("pages.reset-password.reset-password-button")}
        </button>
      </form>
    </div>
  </div>
</div>

<script context="module">
  import { processLoad } from "$lib/ui-logics/page-logics/ResetPasswordPageLogics.js";

  /**
   * @type {import('@sveltejs/kit').LayoutLoad}
   */
  export async function load(event) {
    return await processLoad(event);
  }
</script>

<script>
  import { writable } from "svelte/store";
  import { _ } from "svelte-i18n";

  import { onSubmit } from "$lib/ui-logics/page-logics/ResetPasswordPageLogics";

  import ErrorAlert from "$lib/component/ErrorAlert.svelte";
  import SuccessAlert from "$lib/component/SuccessAlert.svelte";

  const error = writable();
  const message = writable();
  const loading = writable();
  const usernameOrEmail = writable("");
</script>
