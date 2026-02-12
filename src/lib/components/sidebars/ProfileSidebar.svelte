<Sidebar side={side}>
  <div class="card border-0">
    <div class="card-body vstack gap-3">
      <!-- Profile Card -->
      <PlayerHead
        width="64"
        height="64"
        username={user.username}
        inGame={$data.inGame}
        lastActivityTime={$data.lastActivityTime}
        checkTime={checkTime} />
      <PageTitle title={user.username} />
      <div class="text-center">
        <PlayerStatusBadge
          banned={$data.isBanned}
          lastActivityTime={$data.lastActivityTime}
          inGame={$data.inGame}
          checkTime={checkTime} />
      </div>
      <div class="text-center">
        <PlayerPermissionBadge
          permissionGroupName={$data.permissionGroupName} />
      </div>
      <!-- Profile Card End -->
    </div>
  </div>
</Sidebar>

<script context="module">
  import ApiUtil from "$lib/api.util.js";
  import { writable } from "svelte/store";

  const data = writable({
    lastActivityTime: 0,
    inGame: false,
    permissionGroupName: "",
    isBanned: false,
  });

  export const load = async (event) => {
    data.set(
      await ApiUtil.get({
        path: "/api/sidebars/profile",
        request: event,
      }),
    );
  };

  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };
</script>

<script>
  import { getContext, onDestroy, onMount } from "svelte";
  import { _ } from "svelte-i18n";

  import tooltip from "$lib/tooltip.util";

  import PlayerPermissionBadge from "$lib/components/PlayerPermissionBadge.svelte";
  import PlayerStatusBadge from "$lib/components/PlayerStatusBadge.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import PlayerHead from "$lib/components/PlayerHead.svelte";
  import PageTitle from "../PageTitle.svelte";

  export let side;

  const session = getContext("session");

  $: user = $session.user ? $session.user : {};

  let checkTime = 0;
  let interval;

  onMount(() => {
    interval = setInterval(() => {
      checkTime += 1;
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>
