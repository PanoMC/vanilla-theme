<!-- Tickets Page -->

<slot />

<CloseTicketConfirmModal />

<script context="module">
  import { processLoad } from "$lib/ui-logics/layout-logics/TicketsLayoutLogics";

  export async function load(event) {
    return await processLoad(event);
  }
</script>

<script>
  import CloseTicketConfirmModal from "$lib/component/modals/CloseTicketConfirmModal.svelte";
</script>
