{#each hookList as module, i}
  {@const props = hookProps[i] || {}}
  {@const hasPerm =
    !filteredHooks[i]?.permission ||
    hasPermission(filteredHooks[i]?.permission, $page.data.user)}
  {#if module && hasPerm && typeof module !== 'function'}
    {@const Component = module.default || module}
    {@const isInvisible = props.hookOptions?.invisible || filteredHooks[i]?.invisible}

    {#if !isInvisible}
      <svelte:element
        this={tag}
        use:hydrateOrMount={{ module, props, rest, isSSR: !browser }}
        class="hook-view-container {rest.class || ''}"
        style="{tag === 'div' ? 'display: contents;' : ''} {rest.style || ''}"
        hookName={name}
        {...props}
        {...rest}>
        {#if !browser && Component}
          <!-- Server Side SSR -->
          <Component hookName={name} {...props} {...rest} />
        {/if}
      </svelte:element>
    {/if}
  {/if}
{/each}

<script>
  import { panoApiClient } from "$lib/PluginAPI.js";
  import { browser, dev } from "$app/environment";
  import { page } from "$app/stores";
  import { getAllContexts, hydrate, mount, unmount, untrack } from "svelte";
  import { hasPermission } from "$lib/auth.util.js";

  let { name, tag = "div", ...rest } = $props();

  const hookStore = $derived(panoApiClient.ui.hook.get(name));

  const filteredHooks = $derived($hookStore || []);

  let resolvedHooks = $state([]);
  const hookList = $derived(
    resolvedHooks.length > 0
      ? resolvedHooks.map((h) => h.component || h)
      : filteredHooks.map((h) => h.component || h),
  );

  const contexts = getAllContexts();

  // Use passed hooks props if available
  const hookProps = $derived($page.data.hookProps?.[name] || []);

  $effect(() => {
    // Sync with store and resolve any functions if needed (Client only)
    const current = filteredHooks.map((h) => h.component || h);
    if (current.some((h) => typeof h === "function" && !h.prototype)) {
      resolveHooks(current);
    } else {
      resolvedHooks = [];
    }
  });

  async function resolveHooks(list) {
    const resolved = await Promise.all(
      list.map(async (h) => {
        if (typeof h === "function" && !h.prototype) {
          return await h();
        }
        return h;
      }),
    );
    resolvedHooks = resolved;
  }

  function hydrateOrMount(viewContainer, params) {
    let { module, props: currentProps, rest: currentRest } = params;
    const Component = module.default || module;
    if (!browser || !viewContainer || !Component) return;

    // Use $state.raw to prevent Svelte from deep-proxying these props.
    // This ensures components (especially legacy ones) receive plain objects.
    let componentProps = $state.raw({
      hookName: name,
      ...$state.snapshot(currentProps),
      ...$state.snapshot(currentRest)
    });
    let componentInstance;

    // Check if there's SSR content to hydrate
    // In dev mode, skip hydration due to potential Svelte version mismatch with pre-built plugins
    const hasSSRContent = viewContainer.children.length > 0 && !dev;

    try {
      if (hasSSRContent) {
        // Hydrate existing SSR content (production only)
        if (module.hydrate) {
          componentInstance = module.hydrate({
            target: viewContainer,
            props: componentProps,
            context: contexts
          });
        } else {
          componentInstance = hydrate(Component, {
            target: viewContainer,
            props: componentProps,
            context: contexts
          });
        }
      } else {
        // Mount fresh (always in dev mode, or when no SSR content)
        viewContainer.innerHTML = ""; // Clear any SSR content in dev mode
        if (module.mount) {
          componentInstance = module.mount({
            target: viewContainer,
            props: componentProps,
            context: contexts
          });
        } else {
          componentInstance = mount(Component, {
            target: viewContainer,
            props: componentProps,
            context: contexts
          });
        }
      }
    } catch (err) {
      console.warn("[Hook] Hydrate/Mount failed, trying mount:", err);
      try {
        viewContainer.innerHTML = "";
        componentInstance = mount(Component, {
          target: viewContainer,
          props: componentProps,
          context: contexts
        });
      } catch (mountErr) {
        console.warn("[Hook] Mount also failed:", mountErr);
        // In dev mode, show a friendly message instead of breaking the page
        if (dev) {
          viewContainer.innerHTML = `<div style="padding: 1rem; background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; color: #856404;">
            <strong>⚠️ Plugin Dev Mode Issue</strong><br/>
            <small>The plugin component could not be loaded in dev mode due to Svelte version mismatch. 
            This works correctly in production builds.</small>
          </div>`;
        }
      }
    }

    return {
      update(newParams) {
        // Direct object replacement with $state.raw triggers reactivity 
        // without making child properties Proxies.
        const nextCombined = {
          ...$state.snapshot(newParams.props),
          ...$state.snapshot(newParams.rest),
          hookName: name,
        };

        untrack(() => {
          componentProps = nextCombined;

          // Support for legacy components that might not see referential changes
          if (componentInstance && componentInstance.$set) {
            componentInstance.$set(nextCombined);
          }
        });
      },
      destroy() {
        if (componentInstance) {
          try {
            if (module.unmount) {
              module.unmount(componentInstance);
            } else {
              unmount(componentInstance);
            }
          } catch (e) {}
        }
      },
    };
  }
</script>
