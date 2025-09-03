<div class="card">
  <div class="card-body">
    <div class="row justify-content-between pb-3 align-items-center">
      <div class="col-auto">
        <h4 class="card-title mb-md-0">
          {#if data.categoryUrl}
            {@html $_("pages.category-tickets.title", {
              values: {
                categoryName: `<strong
            >"${data.category.title === "-"
                  ? $_("pages.category-tickets.no-category")
                  : data.category.title}"</strong>`
              }
            })}
          {:else}
            {$_("pages.tickets.title")}
          {/if}
        </h4>
      </div>
      {#if !data.categoryUrl}
      <div class="col-md-auto col-12 text-md-right text-center">
        <div class="btn-group">
          <a
            class="btn btn-sm btn-outline-light btn-link"
            class:active="{data.pageType === PageTypes.ALL}"
            role="button"
            href="/tickets">
            {$_("pages.tickets.all")}
          </a>
          <a
            class="btn btn-sm btn-outline-light btn-link text-danger"
            class:active="{data.pageType === PageTypes.CLOSED}"
            role="button"
            href="?pageType=CLOSED">
            {$_("pages.tickets.closed")}
          </a>
        </div>
      </div>
      {/if}
    </div>
    <Tickets
      on:closeTicket="{(event) => onCloseTicketClick(tickets, event.detail.ticket)}"
      tickets="{$tickets}" />
  </div>
</div>

<br />

<!-- Pagination -->
{#if data.ticketCount > 0}
  <Pagination
    page="{data.page}"
    totalPage="{data.totalPage}"
    loading="{false}"
    on:firstPageClick="{() => onPageClick(data, 1)}"
    on:lastPageClick="{() => onPageClick(data, data.totalPage)}"
    on:pageLinkClick="{(event) => onPageClick(data, event.detail.page)}" />
{/if}

<script context="module">
  import { processLoad } from "$lib/ui-logics/page-logics/TicketsPageLogics";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(event) {
    return processLoad(event);
  }
</script>

<script>
  import { _ } from "svelte-i18n";

  import { init, onCloseTicketClick, onPageClick, PageTypes } from "$lib/ui-logics/page-logics/TicketsPageLogics";

  import Pagination from "$lib/component/Pagination.svelte";
  import Tickets from "$lib/component/Tickets.svelte";

  export let data;

  const { tickets } = init(data);
</script>
