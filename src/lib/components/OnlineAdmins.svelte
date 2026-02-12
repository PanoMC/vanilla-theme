<!-- Online Admins Card -->
<div
  class="card h-100"
  hidden={typeof themeSettings.sidebarCarts?.onlineAdmins === "undefined"
    ? false
    : !themeSettings.sidebarCarts.onlineAdmins}>
  <div class="card-header">{$_("components.online-admins.online-admins")}</div>
  <div class="card-body">
    <div class="row">
      {#each onlineAdmins as onlineAdmin, index (onlineAdmin)}
        <div class="col-3">
          <a href="/player/{onlineAdmin}" class="d-inline-block focus-ring rounded">
            <img
              alt={onlineAdmin}
              class="rounded"
              src="https://minotar.net/avatar/{onlineAdmin}"
              use:tooltip={[onlineAdmin, { placement: "bottom" }]}
              width="48"
              height="48" />
          </a>
        </div>
        {:else}
        <NoContent />
      {/each}
    </div>
  </div>
</div>

<!-- Online Admins Card End -->
<script>
  import { _ } from "svelte-i18n";
  import tooltip from "$lib/tooltip.util";
  import { getContext } from "svelte";
    import NoContent from "./NoContent.svelte";

  export let onlineAdmins;

  const themeSettings = getContext("themeSettings");
</script>
