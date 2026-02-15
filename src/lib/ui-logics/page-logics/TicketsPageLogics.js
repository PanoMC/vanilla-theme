import { error } from "@sveltejs/kit";
import { writable } from "svelte/store";

import { goto } from "$app/navigation";

import { buildQueryParams } from "$lib/api.util";
import { executeLifecycle, executeViewLoad, panoApiServer } from "$lib/PluginAPI";

import { getTickets } from "$lib/services/tickets";

import { TicketStatuses } from "$lib/components/TicketStatus.svelte";
import ProfileSidebar, { load as loadSidebar } from "$lib/components/sidebars/ProfileSidebar.svelte";

import {
  onHide as setCloseTicketConfirmOnHideCallback,
  setCallback as setCloseTicketConfirmCallback,
  show as showCloseTicketConfirmModal
} from "$lib/components/modals/CloseTicketConfirmModal.svelte";

export const PageTypes = Object.freeze({
  ALL: "ALL",
  CLOSED: "CLOSED"
});

export const DefaultPageType = PageTypes.ALL;

/**
 * @type {import("@sveltejs/kit").Load}
 */
export async function processLoad(event) {
  const { parent, url: { searchParams } } = event;
  await parent();

  const page = parseInt(searchParams.get("page")) || 1;
  const pageType = searchParams.get("pageType") || DefaultPageType;
  const categoryUrl = searchParams.get("category");

  const data = await getTickets({
    page,
    pageType,
    categoryUrl,
    request: event
  });

  if (data.error) {
    if (data.error === "PAGE_NOT_FOUND" || data.error === "NOT_EXISTS" || data.error === "BAD_REQUEST") {
      throw error(404, data.error);
    }

    throw error(500, data.error);
  }

  data.pageType = pageType;
  data.categoryUrl = categoryUrl;

  // Initialize tickets content
  panoApiServer.ui.tickets.content.edit((items) => {
    items.push({ id: "tickets-card", priority: 100, hidden: false });
  });

  await executeLifecycle("theme:tickets:load", {}, event);
  await executeViewLoad("tickets-content", event);

  await loadSidebar(event);

  return { ...data, sidebar: ProfileSidebar };
}

async function refreshData(data) {
  const queryParams = buildQueryParams({
    page: data.page,
    pageType: data.pageType,
    category: data.categoryUrl
  });

  await goto(queryParams, { invalidateAll: true });
}

export async function onPageClick(data, page) {
  data.page = page;

  await refreshData(data);
}

export const onCloseTicketClick = (tickets, updatedTicket) => {
  tickets.update(tickets => {
    tickets.forEach((ticket) => {
      if (ticket.id === updatedTicket.id) {
        ticket.selected = true;
      }
    });
    return tickets;
  });

  showCloseTicketConfirmModal(updatedTicket);
};

export function init(data) {
  const tickets = writable(data.tickets);

  setCloseTicketConfirmCallback((updatedTicket) => {
    tickets.update(tickets => {
      tickets.forEach((ticket) => {
        if (ticket.id === updatedTicket.id) {
          ticket.status = TicketStatuses.CLOSED;
          ticket.selected = false;
        }
      });
      return tickets;
    });
  });

  setCloseTicketConfirmOnHideCallback(() => {
    tickets.update(tickets => {
      tickets.forEach((ticket) => {
        if (ticket.selected) {
          ticket.selected = false;
        }
      });
      return tickets;
    });
  });

  return { tickets };
}