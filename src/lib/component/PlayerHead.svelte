{#if lastActivityTime}
  <img
    src="https://minotar.net/avatar/{username}"
    class="rounded d-block m-auto"
    width="{width}"
    height="{height}"
    alt="{username}"
    class:border="{isOnline}"
    class:border-5="{isOnline}"
    class:border-success="{isOnline}"
    use:tooltip="{[
      isOnline
        ? $_('components.player-head.' + (inGame ? 'in-game' : 'in-website'))
        : getOfflineRelativeDateText(checkTime),
      { placement: 'right' },
    ]}" />
{:else}
  <img
    src="https://minotar.net/avatar/{username}"
    class="rounded d-block m-auto"
    width="{width}"
    height="{height}"
    alt="{username}" />
{/if}

<script>
  import tooltip from "$lib/tooltip.util";
  import { formatRelative } from "date-fns";
  import * as locales from "date-fns/locale";
  import { currentLanguage } from "$lib/language.util.js";

  import { _ } from "svelte-i18n";

  export let username;
  export let width = 64;
  export let height = 64;
  export let checkTime;
  export let inGame = false;
  export let lastActivityTime;

  $: isOnline = lastActivityTime > Date.now() - 5 * 60 * 1000 || inGame;

  function getOfflineRelativeDateText(checkTime) {
    return formatRelative(new Date(parseInt(lastActivityTime)), new Date(), {
      locale: locales[$currentLanguage.dateFnsCode]
    }).capitalize();
  }

  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };
</script>
