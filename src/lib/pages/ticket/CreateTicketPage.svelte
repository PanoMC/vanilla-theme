<div class="card">
  <div class="card-body">
    <div class="row justify-content-between mb-3">
      <div class="col-auto">
        <h4 class="card-title">{$_("pages.create-ticket.title")}</h4>
      </div>
    </div>

    <ErrorAlert error="{error}" />

    <div class="mb-3">
      <input
        type="text"
        class="form-control form-control-lg mb-3"
        placeholder="{$_('pages.create-ticket.inputs.title')}"
        bind:value="{title}" />

      <select
        class="form-select"
        id="datalistOptions"
        bind:value="{categoryId}">
        <option value="{-1}">{$_("pages.create-ticket.inputs.no-category")}</option>
        {#each data.categories as category, index (category)}
          <option value="{category.id}">{category.title}</option>
        {/each}
      </select>
    </div>

    <!-- Ticket Editor -->
    <div class="mb-3">
      <textarea class="form-control" rows="6" bind:value="{message}"></textarea>
    </div>

    <button
      class="btn btn-primary w-100"
      on:click="{() => submit()}"
      class:disabled="{loading || isButtonDisabled}"
      disabled="{loading || isButtonDisabled}">
      {$_("pages.create-ticket.create-button")}</button>
  </div>
</div>

<script context="module">
  import TicketCreateAndDetailSidebar, {
    load as loadSidebar
  } from "$lib/component/sidebars/TicketCreateAndDetailSidebar.svelte";
  import { getTicketCategories } from "$lib/services/tickets";
  import { error as throwError } from "@sveltejs/kit";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(event) {
    const { parent } = event;
    await parent();

    let data = {
      categories: [],
      categoryPage: 0,
    };

    await loadSidebar(event);

    await getTicketCategories({
      page: data.categoryPage,
      request: event,
    }).then((body) => {
      if (body.error) {
        if (body.error === "NOT_EXISTS") {
          throw throwError(404, body.error);
        }

        throw throwError(500, body.error);
      }

      data = body;
    });

    return { ...data, sidebar: TicketCreateAndDetailSidebar };
  }
</script>

<script>
  import { goto } from "$app/navigation";

  import { createTicket } from "$lib/services/tickets";
  import ErrorAlert from "$lib/component/ErrorAlert.svelte";
  import { NETWORK_ERROR } from "$lib/api.util";
  import { _ } from "svelte-i18n";

  export let data;

  let error;
  let title = "";
  let message = "";
  let categoryId = -1;
  let loading = false;
  $: isButtonDisabled = title === "" || message === "";

  async function submit() {
    error = null;
    loading = true;

    await createTicket({
      title,
      message,
      categoryId,
    })
      .then((body) => {
        loading = false;

        if (body.error) {
          error = body.error;

          return;
        }

        goto("/ticket/" + body.id);
      })
      .catch(() => {
        loading = false;

        error = NETWORK_ERROR;
      });
  }
</script>
