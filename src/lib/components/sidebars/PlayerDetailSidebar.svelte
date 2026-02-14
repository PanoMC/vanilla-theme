<Sidebar side={side}>
  <div class="list-group shadow-sm">
    <div class="list-group-item d-flex flex-column align-items-center py-4">
      <PlayerHead
        username={$data.username}
        inGame={$data.inGame}
        banned={$data.banned}
        lastActivityTime={$data.lastActivityTime}
        checkTime={checkTime}
        width="86"
        height="86" />
    </div>

    <div class="list-group-item p-0">
      <table class="table table-borderless mb-0">
        <tbody>
          <tr>
            <td class="text-center">
              <PlayerStatusBadge
                banned={$data.banned}
                lastActivityTime={$data.lastActivityTime}
                inGame={$data.inGame}
                {checkTime} />
            </td>
          </tr>
          <tr>
            <td class="text-center">
              <span use:tooltip={[$_("pages.profile.perm-group")]}>
                <PlayerPermissionBadge
                  permissionGroupName={$data.permissionGroupName} />
              </span>
            </td>
          </tr>
        </tbody>
      </table>
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
    banned: false,
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
  import { _ } from "svelte-i18n";

  import Sidebar from "$lib/components/Sidebar.svelte";
  import PlayerPermissionBadge from "$lib/components/PlayerPermissionBadge.svelte";
  import PlayerStatusBadge from "$lib/components/PlayerStatusBadge.svelte";
  import PlayerHead from "$lib/components/PlayerHead.svelte";
  import PageTitle from "../PageTitle.svelte";

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
