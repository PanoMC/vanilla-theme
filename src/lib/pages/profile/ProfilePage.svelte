<!-- Statistics -->

<div class="vstack gap-3">

  <div class="card">
    <div class="card-header">{$_("pages.profile.title")}</div>
    <table class="table">
      <tbody>
        <tr>
          <td>{$_("pages.profile.register-date")}</td>
          <td><Date time={data.registerDate} /></td>
        </tr>
        <tr>
          <td>{$_("pages.profile.last-login")}</td>
          <td><Date time={data.lastLoginDate} relativeFormat="true" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<script context="module">
  import { processLoad } from "$lib/ui-logics/page-logics/ProfilePageLogics";

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
  import PageTitle from "$lib/components/PageTitle.svelte";

  export let data;
</script>
