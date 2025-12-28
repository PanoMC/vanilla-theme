<div class="vstack gap-3">
  <PageTitle
    html
    title={data.categoryUrl
      ? $_("pages.category-tickets.title", {
          values: {
            categoryName: `<strong
    >"${
      data.category.title === "-"
        ? $_("pages.category-tickets.no-category")
        : data.category.title
    }"</strong>`,
          },
        })
      : $_("pages.tickets.title")} />

  <div class="btn-group">
    <a
      class="btn btn-outline-primary"
      class:active={data.pageType === PageTypes.ALL}
      role="button"
      href="/tickets">
      {$_("pages.tickets.all")}
    </a>
    <a
      class="btn btn-outline-primary"
      class:active={data.pageType === PageTypes.CLOSED}
      role="button"
      href="/tickets?pageType=CLOSED">
      {$_("pages.tickets.closed")}
    </a>
  </div>

  <div class="card">
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
  import PageTitle from "$lib/component/PageTitle.svelte";

  export let data;

  let tickets;

  $: {
    tickets = init(data).tickets;
  }
</script>
