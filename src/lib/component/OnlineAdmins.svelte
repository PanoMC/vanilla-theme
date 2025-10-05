<!-- Online Admins Card -->
<div
  class="card"
  hidden={onlineAdmins.length === 0
    ? true
    : typeof themeSettings.sidebarCarts?.onlineAdmins === "undefined"
      ? false
      : !themeSettings.sidebarCarts.onlineAdmins}>
  <div class="card-header">{$_("components.online-admins.online-admins")}</div>
  <div class="card-body">
    <div class="row">
      {#each onlineAdmins as onlineAdmin, index (onlineAdmin)}
        <div class="col-3">
          <a href="/player/{onlineAdmin}">
            <img
              alt={onlineAdmin}
              class="rounded"
              src="https://minotar.net/avatar/{onlineAdmin}"
              use:tooltip={[onlineAdmin, { placement: "bottom" }]}
              width="48"
              height="48" />
          </a>
        </div>
      {/each}
    </div>
  </div>
</div>

<!-- Online Admins Card End -->
<script>
  import { _ } from "svelte-i18n";
  import tooltip from "$lib/tooltip.util";
  import { getContext } from "svelte";

  export let onlineAdmins;

  const themeSettings = getContext("themeSettings");
</script>
