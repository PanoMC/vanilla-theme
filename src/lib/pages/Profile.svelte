<!-- Statistics -->
<div class="card">
  <div class="card-body">
    <h5 class="card-title">{$_("pages.profile.title")}</h5>
    <table class="table mb-0">
      <tbody>
        <tr>
          <td>{$_("pages.profile.register-date")}</td>
          <td><Date time="{data.registerDate}" /></td>
        </tr>
        <tr>
          <td>{$_("pages.profile.last-login")}</td>
          <td><Date time="{data.lastLoginDate}" relativeFormat="true" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<script context="module">
  import ProfileSidebar, {
    load as loadSidebar,
  } from "$lib/component/sidebars/ProfileSidebar.svelte";

  import { getProfile } from "$lib/services/profile.js";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(event) {
    const { parent } = event;
    await parent();

    let data = {
      registerDate: 0,
      lastLoginDate: 0,
    };

    await loadSidebar(event);

    await getProfile({ request: event }).then((body) => {
      data = body;
    });

    return { ...data, sidebar: ProfileSidebar };
  }
</script>

<script>
  import { _ } from "svelte-i18n";

  import Date from "$lib/component/Date.svelte";

  export let data;
</script>
