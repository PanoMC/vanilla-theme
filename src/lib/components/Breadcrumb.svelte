<script>
  import { page } from "$app/stores";
  import { _ } from "svelte-i18n";
  import { base } from "$app/paths";

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const segmentMap = {
    support: "nav-links.support",
    profile: "pages.profile.title",
    settings: "pages.settings.title",
    tickets: "pages.tickets.title",
    ticket: "pages.support.title",
    rules: "nav-links.rules",
    login: "buttons.login",
    register: "buttons.register",
    notifications: "pages.notifications.page-title",
  };

  $: pathSegments = $page.url.pathname.split("/").filter(Boolean);

  $: breadcrumbs = [
    { label: $_("nav-links.homepage"), href: base || "/", isHome: true },
    ...pathSegments.map((segment, index) => {
      const href = `${base || ""}/${pathSegments.slice(0, index + 1).join("/")}`;
      let label = segment;

      if (segmentMap[segment]) {
        label = $_(segmentMap[segment]);
      } else if (!isNaN(segment)) {
        label = `#${segment}`;
      } else {
        label = capitalize(segment);
      }

      return { label, href };
    }),
  ];
</script>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb justify-content-center px-3 mb-0">
    {#each breadcrumbs as crumb, i}
      <li
        class="breadcrumb-item small"
        class:active={i === breadcrumbs.length - 1}
        aria-current={i === breadcrumbs.length - 1 ? "page" : undefined}>
        {#if i === breadcrumbs.length - 1}
          {#if crumb.isHome}
            <i class="fas fa-home"></i>
          {:else}
            {crumb.label}
          {/if}
        {:else}
          <a href={crumb.href} class="text-decoration-none badge text-bg-primary rounded-pill">
            {#if crumb.isHome}
              <i class="fas fa-home"></i>
            {:else}
              {crumb.label}
            {/if}
          </a>
        {/if}
      </li>
    {/each}
  </ol>
</nav>

<style>
  .breadcrumb {
    --bs-breadcrumb-divider: "•";
  }
</style>