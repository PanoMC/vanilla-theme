<div class="vstack gap-3">
  <PageTitle
    title={$_("pages.reset-password.title")}
    subtitle={$_("pages.reset-password.description")} />

  <ErrorAlert error={$error} />
  <SuccessAlert message={$message} />
  <form
    on:submit|preventDefault={() =>
      onSubmit(error, message, loading, usernameOrEmail)}>
    <div class="vstack gap-3">
      <div class="form-floating">
        <input
          type="text"
          disabled={$loading}
          placeholder={$_(
            "pages.reset-password.inputs.email-username.placeholder",
          )}
          id="email"
          class="form-control"
          bind:value={$usernameOrEmail} />
        <label for="email"
          >{$_(
            "pages.reset-password.inputs.email-username.placeholder",
          )}</label>
      </div>
      <button
        type="submit"
        class="btn btn-lg btn-secondary w-100"
        class:disabled={$loading || !$usernameOrEmail}
        disabled={$loading || !$usernameOrEmail}>
        {#if $loading}
          <span
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-label="Loading"></span>
          <span>{$_("buttons.reset-password")}...</span>
        {:else}
          {$_("buttons.reset-password")}
        {/if}
      </button>
    </div>
  </form>
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
  import PageTitle from "$lib/component/PageTitle.svelte";

  const error = writable();
  const message = writable();
  const loading = writable();
  const usernameOrEmail = writable("");
</script>
