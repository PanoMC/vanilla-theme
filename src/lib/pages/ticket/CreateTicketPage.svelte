<div class="card">
  <div class="card-header">
    {$_("pages.create-ticket.title")}
  </div>
  <div class="card-body">
    <ErrorAlert error={$error} />

    <div class="input-group mb-3">
      <input
        type="text"
        class="form-control"
        placeholder={$_("pages.create-ticket.inputs.title")}
        bind:value={$title} />

      <select class="form-select" id="datalistOptions" bind:value={$categoryId}>
        <option value={-1}
          >{$_("pages.create-ticket.inputs.no-category")}</option>
        {#each data.categories as category, index (category)}
          <option value={category.id}>{category.title}</option>
        {/each}
      </select>
    </div>

    <!-- Ticket Editor -->
    <div class="mb-3">
      <textarea bind:value={$message} class="form-control" rows="6"></textarea>
    </div>

    <button
      class="btn btn-primary w-100"
      class:disabled={$loading || isButtonDisabled}
      disabled={$loading || isButtonDisabled}
      on:click={() => submit(error, loading, title, message, categoryId)}>
      {$_("pages.create-ticket.create-button")}</button>
  </div>
</div>

<script context="module">
  import { processLoad } from "$lib/ui-logics/page-logics/CreateTicketPageLogics.js";

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

  import { submit } from "$lib/ui-logics/page-logics/CreateTicketPageLogics";

  import ErrorAlert from "$lib/component/ErrorAlert.svelte";

  export let data;

  let error = writable();
  let title = writable("");
  let message = writable("");
  let categoryId = writable(-1);
  let loading = writable(false);

  $: isButtonDisabled = $title === "" || $message === "";
</script>
