<Sidebar side={side}>
  <div class="list-group shadow-sm">
    <div class="list-group-item d-flex flex-column align-items-center py-4 bg-body-tertiary">
      <PlayerHead
        username={user.username}
        inGame={$data.inGame}
        banned={$data.isBanned}
        lastActivityTime={$data.lastActivityTime}
        checkTime={checkTime}
        width="86"
        height="86" />
    </div>

    <div class="list-group-item p-0">
      <table class="table table-borderless">
        <tbody>
          <tr>
            <td class="text-center">
              <PlayerStatusBadge
                banned={$data.isBanned}
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
