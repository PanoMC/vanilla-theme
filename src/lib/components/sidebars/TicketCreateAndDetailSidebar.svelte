<Sidebar side={side}>
  <div class="vstack gap-3">
    {#each $items as item (item.id)}
      {#if item.id === 'online-admins'}
        <!-- Online Admins Snippet -->
        <OnlineAdmins onlineAdmins={$data.onlineAdmins} />
      {:else if item.id === 'close-ticket-button'}
        <!-- Close Ticket Button Snippet -->
        {#if $ticketData && $ticketData.status !== TicketStatuses.CLOSED}
          <button
            class="btn btn-lg btn-danger w-100"
            type="button"
            on:click={() => showCloseTicketConfirmModal($ticketData)}>
            <i class="fas fa-times me-2"></i>
            {$_("buttons.close-ticket")}
          </button>
        {/if}
      {:else}
        <!-- External Component -->
        <ViewComponent component={item.component} data={$data} ticketData={$ticketData} {...item.props} />
      {/if}
    {/each}
  </div>
</Sidebar>

<script context="module">
  import { writable } from "svelte/store";
  import ApiUtil from "$lib/api.util.js";
  import { panoApi } from "$lib/PluginAPI";
  import { executeSidebarLoad } from "$lib/PluginAPI";

  const data = writable({
    onlineAdmins: [],
  });
  const ticketData = writable(null);

  export const load = async (event, ticket) => {
    /* Register Defaults */
    panoApi.ui.sidebar.register({
      sidebarId: "ticket",
      id: "online-admins",
      component: "local:online-admins",
      priority: 100,
    });

    panoApi.ui.sidebar.register({
      sidebarId: "ticket",
      id: "close-ticket-button",
      component: "local:close-ticket-button",
      priority: 90,
    });

    // Execute sidebar load and resolve components for SSR
    await executeSidebarLoad('ticket', event);

    data.set(
      await ApiUtil.get({
        path: "/api/sidebars/support",
        request: event,
      }),
    );

    if (ticket) {
      ticketData.set(ticket);
    }
  };

  export const update = (ticket) => {
    ticketData.set(ticket);
  };
</script>

<script>
  import { _ } from "svelte-i18n";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import ViewComponent from "$lib/components/ViewComponent.svelte";
  import OnlineAdmins from "$lib/components/OnlineAdmins.svelte";
  import { show as showCloseTicketConfirmModal } from "$lib/components/modals/CloseTicketConfirmModal.svelte";
  import { TicketStatuses } from "$lib/components/TicketStatus.svelte";

  export let side;

  const items = panoApi.ui.sidebar.get("ticket");
</script>
