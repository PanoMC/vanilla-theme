<div class="col-lg-4 col-md-6 mx-auto">
  <div class="vstack gap-3">
    <PageTitle title={$_("pages.activate.title")} />

    <div class="card">
      <div class="card-body">
        <div class="vstack gap-3">
          <img
            alt="Allay"
            class="d-block mx-auto"
            src="https://cdn3.emoji.gg/emojis/8182-allay-dancing.gif" />
          <ErrorAlert error={$error} />
          <SuccessAlert message={$successMessage} />
          <button
            class="btn btn-secondary w-100"
            class:disabled={$loading ||
              $error === "INVALID_LINK" ||
              $successMessage !== null}
            disabled={$loading ||
              $error === "INVALID_LINK" ||
              $successMessage !== null}
            on:click={() => verifyEmail(error, successMessage, loading, data)}>
            {#if $loading}
              <span
                class="spinner-border spinner-border-sm me-2"
                role="status"
                aria-label="Loading"></span>
              <span>{$_("buttons.activate-email")}...</span>
            {:else}
              {$_("buttons.activate-email")}
            {/if}
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<script context="module">
  import { processLoad } from "$lib/ui-logics/page-logics/ActiveEmailPageLogics.js";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(event) {
    return processLoad(event);
  }
</script>

<script>
  import { writable } from "svelte/store";
  import { _ } from "svelte-i18n";

  import PageTitle from "$lib/components/PageTitle.svelte";
  import ErrorAlert from "$lib/components/ErrorAlert.svelte";
  import SuccessAlert from "$lib/components/SuccessAlert.svelte";
  import { verifyEmail } from "$lib/ui-logics/page-logics/ActiveEmailPageLogics.js";

  export let data;

  let loading = writable();
  let error = writable();
  let successMessage = writable(null);
</script>
