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
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import { getAllContexts, hydrate, mount, unmount, untrack } from "svelte";
  import { hasPermission } from "$lib/auth.util.js";

  let { name, tag = "div", ...rest } = $props();

  const hookStore = $derived(panoApiClient.ui.hook.get(name));

  const filteredHooks = $derived($hookStore || []);

  let resolvedHooks = $state([]);
  const hookList = $derived(
    resolvedHooks.length > 0
      ? resolvedHooks
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

    // Use a reactive $state object for props to maintain Svelte 5 reactivity
    let componentProps = $state({
      hookName: name,
      ...currentProps,
      ...currentRest,
    });
    let componentInstance;

    // Check if there's SSR content to hydrate
    const hasSSRContent = viewContainer.children.length > 0;

    try {
      if (hasSSRContent) {
        // Hydrate existing SSR content - preserves DOM and prevents animation re-triggers
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
        // No SSR content, mount fresh (dynamic/lazy loaded components)
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
      // Fallback to mount if hydrate fails
      try {
        viewContainer.innerHTML = "";
        componentInstance = mount(Component, {
          target: viewContainer,
          props: componentProps,
          context: contexts
        });
      } catch (mountErr) {
        console.warn("[Hook] Mount also failed:", mountErr);
      }
    }

    return {
      update(newParams) {
        // Surgical update: Only update changed properties to avoid infinite loops
        const nextCombined = {
          ...newParams.props,
          ...newParams.rest,
          hookName: name,
        };

        untrack(() => {
          for (const key in nextCombined) {
            if ($state.snapshot(componentProps[key]) !== $state.snapshot(nextCombined[key])) {
              componentProps[key] = nextCombined[key];
            }
          }
          // Support for legacy components that might not see $state changes
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
