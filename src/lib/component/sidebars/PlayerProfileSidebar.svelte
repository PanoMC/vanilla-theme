<Sidebar side={side}>
  <div class="card">
    <div class="card-header">
      {$data.username}
    </div>
    <div class="card-body vstack gap-3">
      <PlayerHead
        username={$data.username}
        inGame={$data.inGame}
        lastActivityTime={$data.lastActivityTime}
        checkTime={checkTime}
        width="128"
        height="128" />
      <div class="text-center">
        <PlayerPermissionBadge
          permissionGroupName={$data.permissionGroupName} />
      </div>
    </div>
  </div>
</Sidebar>

<script context="module">
  import ApiUtil from "$lib/api.util.js";
  import { writable } from "svelte/store";

  const data = writable({
    username: "",
    lastActivityTime: 0,
    inGame: false,
    permissionGroupName: "",
  });

  export const load = async (event) => {
    data.set({
      ...(await ApiUtil.get({
        path: `/api/sidebars/profile/${event.params.player}`,
        request: event,
      })),
      username: event.params.player,
    });
  };

  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };
</script>

<script>
  import { onDestroy, onMount } from "svelte";

  import Sidebar from "$lib/component/Sidebar.svelte";
  import PlayerPermissionBadge from "$lib/component/PlayerPermissionBadge.svelte";
  import PlayerHead from "$lib/component/PlayerHead.svelte";

  let checkTime = 0;
  let interval;

  export let side;

  onMount(() => {
    interval = setInterval(() => {
      checkTime += 1;
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>
