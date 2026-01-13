{#each $hooks as module, i}
  {@const props = hookProps[i] || {}}
  {#if !browser}
    <!-- Server Side: Native Rendering to preserve Context ($page store) -->
    <svelte:component
      this={module.default || module}
      hookName={name}
      {...props} />
  {:else}
    {#if !props.hookOptions?.invisible}
      <!-- Client Side: Manual Mount/Hydrate to prevent Runtime Mismatch -->
      <div use:mountPlugin={{ module, props }} class="hook-view-container"></div>
    {/if}
  {/if}
{/each}

<script>
  import { panoApiClient } from "$lib/PluginAPI.js";
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import { mount, unmount, hydrate } from "svelte";

  export let name;

  const hooks = panoApiClient.ui.hook.get(name);

  // Use passed hooks props if available
  $: hookProps = $page.data.hookProps?.[name] || [];

  function mountPlugin(viewContainer, { module, props }) {
    const Component = module.default || module;
    if (!browser || !viewContainer || !Component) return;

    let componentInstance;

    try {
      if (module.hydrate) {
        try {
          componentInstance = module.hydrate({
            target: viewContainer,
            props: { hookName: name, ...props },
          });
          console.debug(`[Hook:${name}] (Custom) Hydration Success`);
        } catch (hErr) {
          console.warn(
            `[Hook:${name}] (Custom) Hydration Failed, falling back to Mount:`,
            hErr,
          );
          viewContainer.innerHTML = "";
          componentInstance = module.mount({
            target: viewContainer,
            props: { hookName: name, ...props },
          });
          console.debug(`[Hook:${name}] (Custom) Clean Mount Success`);
        }
      } else {
        try {
          componentInstance = hydrate(Component, {
            target: viewContainer,
            props: { hookName: name, ...props },
          });
          console.debug(`[Hook:${name}] (Native) Hydration Success`);
        } catch (hErr) {
          console.warn(
            `[Hook:${name}] (Native) Hydration Failed, falling back to Mount:`,
            hErr,
          );
          viewContainer.innerHTML = "";
          componentInstance = mount(Component, {
            target: viewContainer,
            props: { hookName: name, ...props },
          });
          console.debug(`[Hook:${name}] (Native) Clean Mount Success`);
        }
      }
    } catch (err) {
      console.warn("[Hook] Mount failed completely:", err);
    }

    return {
      destroy() {
        if (componentInstance) {
          try {
            if (module.unmount) {
              module.unmount(componentInstance);
            } else {
              unmount(componentInstance);
            }
          } catch (e) {
            if (componentInstance?.$destroy) componentInstance.$destroy();
          }
        }
      },
    };
  }
</script>
