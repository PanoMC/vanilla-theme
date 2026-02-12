<Sidebar side="{side}">
  <!-- Online Admins Card -->
  <OnlineAdmins onlineAdmins="{$data.onlineAdmins}" />
  <!-- Online Admins Card End -->
</Sidebar>

<script context="module">
  import ApiUtil from "$lib/api.util.js";
  import { writable } from "svelte/store";

  const data = writable({
    onlineAdmins: [],
  });

  export const load = async (event) => {
    data.set(
      await ApiUtil.get({
        path: "/api/sidebars/support",
        request: event,
      }),
    );
  };
</script>

<script>
  import Sidebar from "$lib/components/Sidebar.svelte";

  import OnlineAdmins from "$lib/components/OnlineAdmins.svelte";

  export let side;
</script>
