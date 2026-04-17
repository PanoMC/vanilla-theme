<Sidebar side={side}>
  <div class="vstack gap-3">
    {#each $items as item (item.id)}
      {#if item.id === "profile-info"}
        <!-- Profile Info Snippet -->
        <div class="card">
          <div class="card-body vstack gap-3">
            <div class="d-block">
              <PlayerHead
                width="64"
                height="64"
                username={user.username}
                inGame={$data.inGame}
                lastActivityTime={$data.lastActivityTime}
                checkTime={checkTime} />
            </div>
            <PageTitle title={user.username} breadcrumb={false} />
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
          </div>
        </div>
      {:else if item.id === "delete-notifications-button"}
        <button
          class="btn btn-danger w-100"
          type="button"
          on:click={() => showDeleteAllNotificationsModal()}>
          <i class="fas fa-trash-alt me-2"></i>
          {$_("buttons.delete-all")}
        </button>
      {:else}
        <!-- External Component -->
        <ViewComponent
          component={item.component}
          data={$data}
          user={user}
          checkTime={checkTime}
          {...item.props} />
      {/if}
    {/each}
  </div>
</Sidebar>

<script context="module">
  import ApiUtil from "$lib/api.util.js";
  import { writable } from "svelte/store";
  import { panoApi } from "$lib/PluginAPI";
  import { executeSidebarLoad } from "$lib/PluginAPI";

  const data = writable({
    lastActivityTime: 0,
    inGame: false,
    permissionGroupName: "",
    isBanned: false,
  });

  export const load = async (event) => {
    /* Register Defaults */
    panoApi.ui.sidebar.register({
      sidebarId: "profile",
      id: "profile-info",
      component: "local:profile-info",
      priority: 100,
    });

    // Execute sidebar load and resolve components for SSR
    await executeSidebarLoad("profile", event);

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
  import ViewComponent from "$lib/components/ViewComponent.svelte";
  import PlayerHead from "$lib/components/PlayerHead.svelte";
  import PageTitle from "../PageTitle.svelte";
  import { show as showDeleteAllNotificationsModal } from "$lib/components/modals/ConfirmRemoveAllNotificationsModal.svelte";

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

  const items = panoApi.ui.sidebar.get("profile");
</script>
