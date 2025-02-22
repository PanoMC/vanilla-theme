<Sidebar>
  <div class="vstack gap-3">
    <!-- Play Button -->
    <button
      class="btn btn-lg btn-secondary w-100 bg-gradient"
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
      <small>Click to copy</small>
    </button>
    <!-- Play Button End -->

    <!-- Server Status Card -->
    <div class="card">
      <div class="card-header">
        {$_("sidebars.home.server-status")}
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          {#if serverOnline}
            {$_("sidebars.home.online")}
          {:else}
            {$_("sidebars.home.offline")}
          {/if}
        </li>
        <li class="list-group-item">
          {#if $data.mainServer}
            {$data.mainServer.playerCount}/{$data.mainServer.maxPlayerCount}
          {:else}
            0/0 playing
          {/if}
        </li>
        <li class="list-group-item">{$data.serverGameVersion} version</li>
      </ul>
    </div>
    <!-- Server Status Card End -->

    <!-- Last Registrants Card -->
    <div class="card">
      <div class="card-header">
        {$_("sidebars.home.last-registrants")}
      </div>
      <div class="card-body">
        <div class="row g-3">
          {#each $data.lastRegisteredUsers as player, index (player)}
            <div class="col-auto">
              <a href="/player/{player}">
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
  import copy from "copy-to-clipboard";

  import Sidebar from "$lib/component/Sidebar.svelte";
  import tooltip from "$lib/tooltip.util";
  import { _ } from "svelte-i18n";

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
