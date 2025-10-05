<Sidebar side={side}>
  <div class="vstack gap-3">
    <!-- Profile Card -->
    <div class="card">
      <div
        class="card-body d-flex flex-column
          align-items-center vstack gap-3">
        <PlayerHead
          width="128"
          height="128"
          username={user.username}
          inGame={$data.inGame}
          lastActivityTime={$data.lastActivityTime}
          checkTime={checkTime} />
        <div class="text-center">
          <h2>{user.username}</h2>
          <PlayerPermissionBadge
            permissionGroupName={$data.permissionGroupName} />
        </div>
      </div>
    </div>
    <!-- Profile Card End -->
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
