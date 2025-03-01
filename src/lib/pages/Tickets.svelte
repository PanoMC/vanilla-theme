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
            href="?pageType=ALL">
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
      tickets="{data.tickets}"
      on:closeTicket="{(event) => onCloseTicketClick(event.detail.ticket)}" />
  </div>
</div>

<br />

<!-- Pagination -->
{#if data.ticketCount > 0}
  <Pagination
    page="{data.page}"
    totalPage="{data.totalPage}"
    loading="{false}"
    on:firstPageClick="{() => onPageClick(1)}"
    on:lastPageClick="{() => onPageClick(data.totalPage)}"
    on:pageLinkClick="{(event) => onPageClick(event.detail.page)}" />
{/if}

<script context="module">
  import ProfileSidebar, { load as loadSidebar } from "$lib/component/sidebars/ProfileSidebar.svelte";
  import { getTickets } from "$lib/services/tickets.js";
  import { error } from "@sveltejs/kit";

  export const PageTypes = Object.freeze({
    ALL: "ALL",
    CLOSED: "CLOSED",
  });

  export const DefaultPageType = PageTypes.ALL;

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(event) {
    const { parent, url: { searchParams } } = event;
    await parent();

    const page = parseInt(searchParams.get("page")) || 1;
    const pageType = searchParams.get("pageType") || DefaultPageType;
    const categoryUrl = searchParams.get("category");

    const data = await getTickets({
      page,
      pageType,
      categoryUrl,
      request: event,
    })

    if (data.error) {
      if (data.error === "PAGE_NOT_FOUND" || data.error === "NOT_EXISTS") {
        throw error(404, data.error);
      }

      throw error(500, data.error);
    }

    data.pageType = pageType;
    data.categoryUrl = categoryUrl;

    await loadSidebar(event);

    return { ...data, sidebar: ProfileSidebar };
  }
</script>

<script>
  import { _ } from "svelte-i18n";

  import { goto } from "$app/navigation";

  import Pagination from "$lib/component/Pagination.svelte";
  import Tickets from "$lib/component/Tickets.svelte";
  import {
    show as showCloseTicketConfirmModal,
    setCallback as setCloseTicketConfirmCallback,
    onHide as setCloseTicketConfirmOnHideCallback,
  } from "$lib/component/modals/CloseTicketConfirmModal.svelte";

  import { TicketStatuses } from "$lib/component/TicketStatus.svelte";
  import { buildQueryParams } from "../../pano-ui/js/api.util.js";

  export let data;

  async function refreshData() {
    const queryParams = buildQueryParams({
      page: data.page,
      pageType: data.pageType,
      category: data.categoryUrl
    });

    await goto(queryParams, { invalidateAll: true });
  }

  async function onPageClick(page) {
    data.page = page;

    await refreshData();
  }

  const onCloseTicketClick = (updatedTicket) => {
    data.tickets.forEach((ticket) => {
      if (ticket.id === updatedTicket.id) {
        ticket.selected = true;
      }
    });

    data.tickets = data.tickets;

    showCloseTicketConfirmModal(updatedTicket);
  };

  setCloseTicketConfirmCallback((updatedTicket) => {
    data.tickets.forEach((ticket) => {
      if (ticket.id === updatedTicket.id) {
        ticket.status = TicketStatuses.CLOSED;
        ticket.selected = false;
      }
    });

    data.tickets = data.tickets;
  });

  setCloseTicketConfirmOnHideCallback(() => {
    data.tickets.forEach((ticket) => {
      if (ticket.selected) {
        ticket.selected = false;
      }
    });

    data.tickets = data.tickets;
  });
</script>
