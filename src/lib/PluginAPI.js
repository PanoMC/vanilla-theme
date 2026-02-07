import { baseAPI, pageAPI } from "../pano-sdk/core/js/PluginAPI";
import { derived, get, writable } from "svelte/store";

const hooks = writable({});
const siteNavLinks = writable([]);

export async function init() {
  hooks.set({});
  siteNavLinks.set([]);
  lifecycleHandlers.set({});
}

const lifecycleHandlers = writable({});

export async function executeLifecycle(name, data, event) {
  const handlers = get(lifecycleHandlers)[name] || [];
  for (const handler of handlers) {
    try {
      await handler(data, event);
    } catch (e) {
      console.error(`[Lifecycle:${name}] failed`, e);
    }
  }
}

export const panoApi = {
  ...baseAPI,
  ui: {
    ...pageAPI,
    nav: {
      site: {
        editNavLinks(callback) {
          siteNavLinks.update(links => callback(links) || links);
        },
        getNavLinks() {
          return siteNavLinks;
        }
      }
    },
    app: {
      onLoad(handler) {
        panoApi.ui.lifecycle.on("theme:app:load", handler);
      }
    },
    post: {
      onLoad(handler) {
        panoApi.ui.lifecycle.on('theme:post-detail:load', handler);
      }
    },
    lifecycle: {
      on(name, handler) {
        lifecycleHandlers.update(h => {
          if (!h[name]) h[name] = [];
          h[name].push(handler);
          return h;
        });
      },
    },
    hook: {
      register(options) {
        const { name } = options;
        hooks.update(h => {
          if (!h[name]) h[name] = [];
          h[name].push(options);
          return h;
        });
      },
      get(name) {
        return derived(hooks, $h => {
          const rawHooks = $h[name] || [];
          // Sort by component.toString() to ensure stable order regardless of registration/import order
          // Deterministic order is crucial for server-client prop synchronization
          return [...rawHooks].sort((a, b) => {
            const getSource = (item) => {
              const comp = item.component || "";
              const source = comp._original || comp;
              return source._importer ? source._importer.toString() : source.toString();
            };
            const keyA = getSource(a);
            const keyB = getSource(b);
            return keyA.localeCompare(keyB);
          });
        });
      },
      setVisible(name, component, visible) {
        hooks.update(h => {
          if (!h[name]) return h;
          const idx = h[name].findIndex(item => item.component === component || item.component?._original === component);
          if (idx !== -1) {
            h[name][idx].invisible = !visible;
          }
          return h;
        });
      }
    }
  },
};

const hookExecutionCache = new WeakMap();
const componentLoadCache = new WeakMap();

export async function executeHookLoad(name, originalEvent) {
  // Prevent double execution of the SAME hook name during the same load cycle
  const event = originalEvent ? { ...originalEvent, hookName: name } : { hookName: name };
  // Use originalEvent as a stable cache key if possible, otherwise fall back to the local event object
  const cacheKey = (originalEvent && typeof originalEvent === "object") ? originalEvent : event;

  if (cacheKey) {
    if (!hookExecutionCache.has(cacheKey)) {
      hookExecutionCache.set(cacheKey, {});
    }
    const cache = hookExecutionCache.get(cacheKey);
    if (cache[name]) {
      return cache[name];
    }
  }

  const $h = get(hooks);
  let list = $h[name] || [];

  // MUST match the sort order used in 'get' accessor
  list = [...list].sort((a, b) => {
    const getSource = (item) => {
      const comp = item.component || "";
      const source = comp._original || comp;
      return source._importer ? source._importer.toString() : source.toString();
    };
    const keyA = getSource(a);
    const keyB = getSource(b);
    return keyA.localeCompare(keyB);
  });

  const results = [];

  for (let i = 0; i < list.length; i++) {
    const entry = list[i];
    const raw = entry.component || entry;
    let module = raw;
    if (typeof raw === 'function' && !raw.prototype) {
      module = await raw();
      // Cache the resolved module back into the hooks store
      hooks.update(h => {
        if (h[name]) {
          // Find the actual index in the original unsorted array
          const actualIdx = h[name].findIndex(item => (item.component || item) === raw);
          if (actualIdx !== -1) {
            const resolved = { ...module, _original: raw };
            if (module.default) resolved.default = module.default;

            if (h[name][actualIdx].component) {
              h[name][actualIdx].component = resolved;
            } else {
              h[name][actualIdx] = resolved;
            }
          }
        }
        return h;
      });
    } else if (typeof raw !== 'object' || !raw.default) {
      module = { default: raw };
    }

    let props = {};
    const Component = module.default || module;
    const loadFn = module.load || (Component && Component.load);

    if (loadFn && !entry.skipLoad) {
      // PER-EVENT COMPONENT CACHE: If this component already loaded for another hook in this event, reuse results.
      let eventCache = null;
      if (cacheKey) {
        if (!componentLoadCache.has(cacheKey)) componentLoadCache.set(cacheKey, new Map());
        eventCache = componentLoadCache.get(cacheKey);
      }

      if (eventCache && eventCache.has(module)) {
        props = eventCache.get(module);
      } else {
        try {
          props = await loadFn(event);
          if (eventCache) eventCache.set(module, props);
        } catch (e) {
          console.warn(`[Hook:${name}] Load failed`, e);
        }
      }
    }
    results.push(props && typeof props === "object" ? { ...props } : {});
  }

  // Cache the final results for this specific hook name
  if (cacheKey && results.length > 0) {
    const cache = hookExecutionCache.get(cacheKey);
    cache[name] = results;
  }

  return results;
}

export const panoApiServer = {
  ...panoApi,
};

export const panoApiClient = {
  ...panoApi,
};
