<div class="card">
  <div class="card-body">
    <div class="row justify-content-between pb-3 align-items-center">
      <div class="col-auto">
        <h4 class="card-title mb-md-0">{$_("pages.tickets.title")}</h4>
      </div>
      <div class="col-md-auto col-12 text-md-right text-center">
        <div class="btn-group">
          <a
            class="btn btn-sm btn-outline-light btn-link"
            class:active="{data.pageType === PageTypes.ALL}"
            role="button"
            href="/tickets/all">
            {$_("pages.tickets.all")}
          </a>
          <a
            class="btn btn-sm btn-outline-light btn-link text-danger"
            class:active="{data.pageType === PageTypes.CLOSED}"
            role="button"
            href="/tickets/closed">
            {$_("pages.tickets.closed")}
          </a>
        </div>
      </div>
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
    on:firstPageClick="{() => reloadData(1)}"
    on:lastPageClick="{() => reloadData(data.totalPage)}"
    on:pageLinkClick="{(event) => reloadData(event.detail.page)}" />
{/if}

<script context="module">
  import ProfileSidebar, {
    load as loadSidebar,
  } from "$lib/component/sidebars/ProfileSidebar.svelte";
  import { getTickets } from "$lib/services/tickets.js";

  export const PageTypes = Object.freeze({
    ALL: "ALL",
    CLOSED: "CLOSED",
  });

  export const DefaultPageType = PageTypes.ALL;

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(event, pageType = DefaultPageType) {
    const { parent } = event;
    await parent();

    pageType = pageType.toUpperCase()

    let data = {
      tickets: [],
      ticketCount: 0,
      page: 1,
      totalPage: 1,
      pageType,
    };

    await loadSidebar(event);

    await getTickets({
      page: event.params.page || 1,
      pageType,
      request: event,
    }).then((body) => {
      if (body.error) {
        data = {};

        return;
      }

      data = body;
    });

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

  export let data;

  function reloadData(page = data.page, pageType = data.pageType) {
    getTickets({ page, pageType }).then((body) => {
      if (body.result === "ok") {
        if (page !== data.page) {
          goto(
            page === 1
              ? "/tickets/" + pageType
              : "/tickets/" + pageType + "/" + page
          );
        } else {
          data = body;
        }
      } else if (body.error === "PAGE_NOT_FOUND") {
        reloadData(page - 1);
      }
    });
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
