<Sidebar side={side}>
  <div class="card">
    <div class="card-body vstack gap-3">
      <!-- Profile Card -->
      <PlayerHead
        width="64"
        height="64"
        username={user.username}
        inGame={$data.inGame}
        lastActivityTime={$data.lastActivityTime}
        checkTime={checkTime} />
      <div class="text-center">
        <h3>{user.username}</h3>
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

  import PlayerPermissionBadge from "$lib/component/PlayerPermissionBadge.svelte";
  import Sidebar from "$lib/component/Sidebar.svelte";
  import PlayerHead from "$lib/component/PlayerHead.svelte";

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
