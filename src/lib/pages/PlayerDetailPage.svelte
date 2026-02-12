<!-- Statistics -->
<div class="card">
  <div class="card-header">
    {$_("pages.player-profile.title")}
  </div>
  <table class="table">
    <tbody>
      <tr>
        <td>{$_("pages.player-profile.register-date")}</td>
        <td><Date time={data.registerDate} /></td>
      </tr>
    </tbody>
  </table>
</div>

<script context="module">
  import { processLoad } from "$lib/ui-logics/page-logics/PlayerDetailPageLogics";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(event) {
    return processLoad(event);
  }
</script>

<script>
  import { _ } from "svelte-i18n";

  import Date from "$lib/components/Date.svelte";

  export let data;
</script>
