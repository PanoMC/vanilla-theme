<tr class:table-primary={ticket.selected}>
  <th scope="row" class="text-center align-middle">
    {#if ticket.status !== TicketStatuses.CLOSED}
      <button
        type="button"
        title={$_("buttons.close-ticket")}
        aria-label={$_("buttons.close-ticket")}
        class="btn btn-link"
        on:click={() => onCloseTicket()}>
        <i class="fas fa-times"></i>
      </button>
    {/if}
  </th>
  <td class="align-middle text-nowrap">
    <a
      class="rounded focus-ring"
      href="/ticket/{ticket.id}"
      title={$_("components.ticket-row.show-ticket")}
      >#{ticket.id} {ticket.title}</a>
  </td>
  <td class="align-middle">
    <TicketStatus status={ticket.status} />
  </td>
  <td class="align-middle text-nowrap">
    <a
      use:tooltip={[
        $_("components.ticket-row.filter"),
        { placement: "bottom" },
      ]}
      class="badge rounded-pill text-bg-light focus-ring"
      href="/tickets?category={ticket.category.url}">
      {ticket.category.title === "-"
        ? $_("components.ticket-row.no-category")
        : ticket.category.title}
    </a>
  </td>
  <td class="align-middle text-nowrap"
    ><span><Date time={ticket.lastUpdate} /></span></td>
</tr>

<script>
  import { createEventDispatcher } from "svelte";
  import { _ } from "svelte-i18n";

  import tooltip from "$lib/tooltip.util";
  import TicketStatus, {
    TicketStatuses,
  } from "$lib/component/TicketStatus.svelte";
  import Date from "$lib/component/Date.svelte";

  export let ticket;

  const dispatch = createEventDispatcher();

  function onCloseTicket() {
    dispatch("closeTicket", { ticket });
  }
</script>
