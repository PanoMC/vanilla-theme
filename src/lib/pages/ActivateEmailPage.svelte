<div class="col-lg-4 col-md-6 m-auto">
  <div class="card">
    <div class="card-body">
      <h3 class="card-title">{$_("pages.activate.title")}</h3>
      <img
        alt="Allay"
        src="https://cdn3.emoji.gg/emojis/8182-allay-dancing.gif" />
      <ErrorAlert error="{$error}" />
      <SuccessAlert message="{$successMessage}" />
      <button
        class="btn btn-secondary w-100"
        class:disabled="{$loading ||
          $error === 'INVALID_LINK' ||
          $successMessage !== null}"
        on:click="{() => verifyEmail($error, $successMessage, $loading, data)}">{$_("buttons.activate-email")}</button>
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

  import ErrorAlert from "$lib/component/ErrorAlert.svelte";
  import SuccessAlert from "$lib/component/SuccessAlert.svelte";

  export let data;

  let loading = writable();
  let error = writable();
  let successMessage = writable(null);
</script>
