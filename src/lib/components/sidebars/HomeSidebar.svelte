<Sidebar side={side}>
  <div class="vstack gap-3">
    {#each $items as item (item.id)}
      {#if item.id === "play-button"}
        <!-- Combined Server Card -->
        <div class="card position-relative overflow-hidden">
          <div class="card-header position-relative z-1 bg-transparent">
            <button
              class="btn btn-link text-reset w-100 rounded focus-ring border-0 fs-3 text-decoration-none"
              type="button"
              on:click={onCopyCommandTextClick}
              use:tooltip={[
                isCommandTextCopied
                  ? $_("sidebars.home.copied")
                  : $_("sidebars.home.copy"),
                { placement: "bottom", hideOnClick: false },
              ]}>
              <b class="d-block mb-2">{$data.ipAddress}</b>
            </button>
          </div>
          <div class="card-body p-0 position-relative z-1">
            <ul class="list-group list-group-flush text-center lead bg-transparent">
              <li class="list-group-item border-0 py-2 bg-transparent">
                {#if serverOnline}
                  <span class="badge text-bg-success"
                    >{$_("sidebars.home.online")}</span>
                {:else}
                  <span class="badge text-bg-danger rounded-pill"
                    >{$_("sidebars.home.offline")}</span>
                {/if}
              </li>
              <li class="list-group-item border-0 py-2 bg-transparent">
                {$_("sidebars.home.playing", {
                  values: {
                    playerCount: $data.mainServer?.playerCount || 0,
                    maxPlayerCount: $data.mainServer?.maxPlayerCount || 0,
                  },
                })}
              </li>
              <li class="list-group-item border-0 py-2 bg-transparent">
                {$data.serverGameVersion}
              </li>
            </ul>
          </div>
        </div>
      {:else if item.id === "server-info"}
        <!-- Merged into play-button -->
      {:else if item.id === "last-registrants"}
        <!-- Last Registrants Snippet -->
        <div
          class="card"
          hidden={typeof themeSettings.sidebarCarts?.lastRegistrants ===
          "undefined"
            ? false
            : !themeSettings.sidebarCarts.lastRegistrants}>
          <CardHeader headerClasses="bg-transparent">
            <div slot="left">
              {$_("sidebars.home.last-registrants")}
            </div>
          </CardHeader>
          <div class="card-body">
            <div class="row g-3">
              {#each $data.lastRegisteredUsers || [] as player, index (player)}
                <div class="col-auto">
                  <a
                    href="/player/{player.username}"
                    class="d-inline-block rounded focus-ring">
                    <img
                      alt={player.username}
                      class="rounded"
                      src="/api/profile/picture/{player.username}?{$avatarVersion}"
                      use:tooltip={[player.username, { placement: "bottom" }]}
                      width="48"
                      height="48" />
                  </a>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {:else}
        <!-- External Component -->
        <ViewComponent
          component={item.component}
          data={$data}
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

  const data = writable({});

  export const load = async (event) => {
    /* Register Defaults */
    panoApi.ui.sidebar.register({
      sidebarId: "home",
      id: "play-button",
      component: "local:play-button",
      priority: 100,
    });

    /* Server Info is merged into play-button */

    panoApi.ui.sidebar.register({
      sidebarId: "home",
      id: "last-registrants",
      component: "local:last-registrants",
      priority: 80,
    });

    // Execute sidebar load and resolve components for SSR
    await executeSidebarLoad("home", event);

    data.set(
      await ApiUtil.get({
        path: "/api/sidebars/home",
        request: event,
      }),
    );
  };
</script>

<script>
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";
  import copy from "copy-to-clipboard";
  import tooltip from "$lib/tooltip.util";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import CardHeader from "$lib/components/CardHeader.svelte";
  import ViewComponent from "$lib/components/ViewComponent.svelte";
  import { avatarVersion } from "$lib/Store";

  export let side;

  const themeSettings = getContext("themeSettings");

  /* Play Button Logic */
  let copyClickIDForCommandText = 0;
  let isCommandTextCopied = false;

  function onCopyCommandTextClick() {
    copyClickIDForCommandText++;
    const id = copyClickIDForCommandText;
    copy($data.ipAddress);
    isCommandTextCopied = true;
    setTimeout(function () {
      if (copyClickIDForCommandText === id) {
        isCommandTextCopied = false;
      }
    }, 1000);
  }

  /* Server Info Logic */
  $: serverOnline = $data.mainServer && $data.mainServer.status === "ONLINE";

  /* Register Defaults */
  // Moved to load function

  const items = panoApi.ui.sidebar.get("home");
</script>

<style lang="scss">
</style>
