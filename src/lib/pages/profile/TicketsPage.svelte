<div class="vstack gap-3">
  <div class="card">
    <div
      class="card-header d-flex justify-content-between align-items-center flex-column flex-md-row gap-2">
      <div>
        {@html data.categoryUrl
          ? $_("pages.category-tickets.title", {
              values: {
                categoryName: `<strong>"${
                  data.category.title === "-"
                    ? $_("pages.category-tickets.no-category")
                    : data.category.title
                }"</strong>`,
              },
            })
          : $_("pages.tickets.title")}
      </div>
      <div class="btn-group">
        <a
          class="btn btn-outline-primary btn-sm"
          class:active={data.pageType === PageTypes.ALL}
          role="button"
          href="/tickets">
          {$_("pages.tickets.all")}
        </a>
        <a
          class="btn btn-outline-primary btn-sm"
          class:active={data.pageType === PageTypes.CLOSED}
          role="button"
          href="/tickets?pageType=CLOSED">
          {$_("pages.tickets.closed")}
        </a>
      </div>
    </div>
    <Tickets
      on:closeTicket={(event) =>
        onCloseTicketClick(tickets, event.detail.ticket)}
      tickets={$tickets} />

    {#if data.ticketCount > 0}
      <div class="card-footer">
        <Pagination
          page={data.page}
          totalPage={data.totalPage}
          loading={false}
          on:firstPageClick={() => onPageClick(data, 1)}
          on:lastPageClick={() => onPageClick(data, data.totalPage)}
          on:pageLinkClick={(event) => onPageClick(data, event.detail.page)} />
      </div>
    {/if}
  </div>
</div>

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

  import {
    init,
    onCloseTicketClick,
    onPageClick,
    PageTypes,
  } from "$lib/ui-logics/page-logics/TicketsPageLogics";

  import Pagination from "$lib/component/Pagination.svelte";
  import Tickets from "$lib/component/Tickets.svelte";

  export let data;

  let tickets;

  $: {
    tickets = init(data).tickets;
  }
</script>
