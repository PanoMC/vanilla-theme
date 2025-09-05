<div class="col-lg-4 col-md-6 m-auto">
  <div class="card">
    <div class="card-header">
      {$_("pages.reset-password.title")}
    </div>
    <div class="card-body">
      <ErrorAlert error={$error} />
      <SuccessAlert message={$message} />
      <form
        on:submit|preventDefault={() =>
          onSubmit(error, message, loading, usernameOrEmail)}>
        <p>
          {$_("pages.reset-password.description")}
        </p>

        <div class="mb-3">
          <input
            type="text"
            placeholder={$_(
              "pages.reset-password.inputs.email-username.placeholder",
            )}
            id="email"
            class="form-control"
            bind:value={$usernameOrEmail} />
        </div>
        <button
          type="submit"
          class="btn btn-secondary w-100"
          class:disabled={$loading || !$usernameOrEmail}>
          {$_("buttons.reset-password")}
        </button>
      </form>
    </div>
  </div>
</div>

<script context="module">
  import { processLoad } from "$lib/ui-logics/page-logics/ResetPasswordPageLogics";

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
