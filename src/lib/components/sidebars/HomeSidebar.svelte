<Sidebar side={side}>
  <div class="vstack gap-3">
    {#each $items as item (item.id)}
      {#if item.id === 'play-button'}
        <!-- Play Button Snippet -->
        <button
          class="btn btn-secondary btn-lg w-100"
          type="button"
          on:click={onCopyCommandTextClick}
          use:tooltip={[
            isCommandTextCopied
              ? $_("sidebars.home.copied")
              : $_("sidebars.home.copy"),
            { placement: "bottom", hideOnClick: false },
          ]}>
          <b>{$data.ipAddress}</b>
          <br />
          <span class="fs-6 fw-normal opacity-75">
            {$_("buttons.click-to-copy")}</span>
        </button>
      {:else if item.id === 'server-info'}
        <!-- Server Info Snippet -->
        <div class="d-flex flex-column align-items-center justify-content-stretch">
          <ul class="list-group w-100 text-center">
            <li class="list-group-item">
              {#if serverOnline}
                <span class="badge text-bg-success"
                  >{$_("sidebars.home.online")}</span>
              {:else}
                <span class="badge text-bg-danger rounded-pill"
                  >{$_("sidebars.home.offline")}</span>
              {/if}
            </li>
            <li class="list-group-item">
              {$_("sidebars.home.playing", {
                values: {
                  playerCount: $data.mainServer?.playerCount || 0,
                  maxPlayerCount: $data.mainServer?.maxPlayerCount || 0,
                },
              })}
            </li>
            <li class="list-group-item">
              {$data.serverGameVersion}
            </li>
          </ul>
        </div>
      {:else if item.id === 'last-registrants'}
        <!-- Last Registrants Snippet -->
        <div
          class="card"
          hidden={typeof themeSettings.sidebarCarts?.lastRegistrants === "undefined"
            ? false
            : !themeSettings.sidebarCarts.lastRegistrants}>
          <div class="card-header">
            {$_("sidebars.home.last-registrants")}
          </div>
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
        <ViewComponent component={item.component} data={$data} {...item.props} />
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

    panoApi.ui.sidebar.register({
      sidebarId: "home",
      id: "server-info",
      component: "local:server-info",
      priority: 90,
    });

    panoApi.ui.sidebar.register({
      sidebarId: "home",
      id: "last-registrants",
      component: "local:last-registrants",
      priority: 80,
    });

    // Execute sidebar load and resolve components for SSR
    await executeSidebarLoad('home', event);

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
