<tr class:table-primary="{ticket.selected}">
  <th scope="row">
    {#if ticket.status !== TicketStatuses.CLOSED}
      <a
        use:tooltip="{[
          $_('components.ticket-row.close-ticket'),
          { placement: 'bottom', hideOnClick: false },
        ]}"
        class="btn btn-link link-danger"
        role="button"
        href="javascript:void(0);"
        on:click="{() => onCloseTicket()}">
        <i class="fas fa-times"></i>
      </a>
    {/if}
  </th>
  <td class="align-middle text-nowrap">
    <a href="/ticket/{ticket.id}" title="{$_('components.ticket-row.show-ticket')}"
      >#{ticket.id} {ticket.title}</a>
  </td>
  <td class="align-middle text-nowrap">
    <TicketStatus status="{ticket.status}" />
  </td>
  <td class="align-middle text-nowrap">
    <a
      use:tooltip="{[$_('components.ticket-row.filter'), { placement: 'bottom' }]}"
      class="badge rounded-pill bg-light text-black"
      href="/tickets?category={ticket.category.url}">
      {ticket.category.title === "-" ? $_('components.ticket-row.no-category') : ticket.category.title}
    </a>
  </td>
  <td class="align-middle text-nowrap"
    ><span><Date time="{ticket.lastUpdate}" /></span></td>
</tr>

<script>
  import { createEventDispatcher } from "svelte";
  import { _ } from "svelte-i18n";

  import tooltip from "$lib/tooltip.util";
  import TicketStatus, { TicketStatuses } from "$lib/component/TicketStatus.svelte";
  import Date from "$lib/component/Date.svelte";

  export let ticket;

  const dispatch = createEventDispatcher();

  function onCloseTicket() {
    dispatch("closeTicket", { ticket });
  }
</script>
