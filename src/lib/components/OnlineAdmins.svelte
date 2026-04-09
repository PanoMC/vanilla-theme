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
    <div class="online-admins-grid">
      {#each onlineAdmins as onlineAdmin, index (onlineAdmin)}
        <a
          href="/player/{onlineAdmin}"
          class="online-admin-link focus-ring rounded position-relative">
          <img
            src="/api/profile/picture/{onlineAdmin}?{$avatarVersion}"
            class="online-admin-avatar rounded border border-3 border-success"
            alt={onlineAdmin}
            use:tooltip={[
              $_("components.player-head.in-website"),
              { placement: "bottom" },
            ]} />
        </a>
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

  export let onlineAdmins;

  const themeSettings = getContext("themeSettings");
</script>

<style>
    .online-admins-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: flex-start;
    }

    .online-admin-link {
        display: block;
        flex-shrink: 0;
    }

    .online-admin-avatar {
        display: block;
        width: 48px;
        height: 48px;
        object-fit: cover;
    }
</style>
