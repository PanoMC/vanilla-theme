<Sidebar side={side}>
  <div class="vstack gap-3">
    <!-- Play Button -->
    <div class="ratio ratio-1x1">
      <div class="card" data-bs-theme="light">
        <div class="card-header text-bg-secondary p-0">
          <button
            class="btn btn-lg btn-link link-dark bg-gradient text-decoration-none w-100 focus-ring rounded-bottom-0"
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
            <span class="fs-6 fw-normal opacity-50">
              {$_("buttons.click-to-copy")}</span>
          </button>
        </div>
        <div
          class="card-body rounded-bottom d-flex flex-column align-items-center justify-content-center blocks">
          <ul class="list-group list-group-flush text-center">
            <li class="list-group-item">
              {#if serverOnline}
                {$_("sidebars.home.online")}
              {:else}
                {$_("sidebars.home.offline")}
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
      </div>
    </div>
    <!-- Play Button End -->

    <!-- Last Registrants Card -->
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
          {#each $data.lastRegisteredUsers as player, index (player)}
            <div class="col-auto">
              <a
                href="/player/{player}"
                class="d-inline-block rounded focus-ring">
                <img
                  alt={player}
                  class="rounded"
                  src="https://minotar.net/avatar/{player}"
                  use:tooltip={[player, { placement: "bottom" }]}
                  width="48"
                  height="48" />
              </a>
            </div>
          {/each}
        </div>
      </div>
    </div>
    <!-- Last Registrants Card End -->
  </div>
</Sidebar>

<script context="module">
  import ApiUtil from "$lib/api.util.js";
  import { writable } from "svelte/store";

  const data = writable({});

  export const load = async (event) => {
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

  import Sidebar from "$lib/component/Sidebar.svelte";
  import tooltip from "$lib/tooltip.util";

  export let side;

  const themeSettings = getContext("themeSettings");

  let copyClickIDForCommandText = 0;
  let isCommandTextCopied = false;

  $: serverOnline = $data.mainServer && $data.mainServer.status === "ONLINE";

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
</script>
