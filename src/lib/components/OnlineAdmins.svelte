<!-- Online Admins Card -->
<div
  class="card h-100"
  hidden={typeof themeSettings.sidebarCarts?.onlineAdmins === "undefined"
    ? false
    : !themeSettings.sidebarCarts.onlineAdmins}>
  <CardHeader headerClasses="bg-transparent">
    <div slot="left">{$_("components.online-admins.online-admins")}</div>
  </CardHeader>
  <div class="card-body">
    <div class="row">
      {#each onlineAdmins as onlineAdmin, index (onlineAdmin)}
        <div class="col-3">
          <a
            href="/player/{onlineAdmin}"
            class="d-inline-block focus-ring rounded position-relative">
            <img
              src="/api/profile/picture/{onlineAdmin}?{$avatarVersion}"
              class="img-thumbnail rounded border border-3 border-success d-block m-auto"
              alt={onlineAdmin}
              use:tooltip={[
                $_("components.player-head.in-website"),
                { placement: "bottom" },
              ]}
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
  import { avatarVersion } from "$lib/Store";
  import tooltip from "$lib/tooltip.util";
  import { getContext } from "svelte";
  import NoContent from "./NoContent.svelte";
  import CardHeader from "./CardHeader.svelte";
  import PlayerHead from "./PlayerHead.svelte";

  export let onlineAdmins;

  const themeSettings = getContext("themeSettings");
</script>
