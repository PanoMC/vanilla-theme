<h3>{page.status}: {page.status === 404 ? $_("page-errors." + page.status) : page.error.message}</h3>

<script>
  import { _ } from "svelte-i18n";

  import { page } from "$app/state";
</script>
