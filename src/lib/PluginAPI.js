import { baseAPI, pageAPI } from "../pano-sdk/core/js/PluginAPI";
import { derived, get, writable } from "svelte/store";
import { plugins } from "../pano-sdk/core/js/PluginManager.js";

const hooks = writable({});
const sidebarItems = writable({});
const siteNavLinks = writable([]);

// Version-based sidebar caching using plugin IDs and versions
const sidebarLoadedCacheKeys = new Map(); // Map<sidebarId, pluginCacheKey>

function generatePluginCacheKey() {
  const loadedPlugins = get(plugins);
  // Handle case where plugins store is not yet initialized
  if (!loadedPlugins || typeof loadedPlugins !== 'object') {
    return "";
  }
  // Create a stable cache key from plugin IDs and versions
  return Object.keys(loadedPlugins)
    .sort()
    .map((pluginId) => {
      const plugin = loadedPlugins[pluginId];
      const version = plugin.version?.version || plugin.version || "dev";
      return `${pluginId}:${version}`;
    })
    .join(",");
}

export async function init() {
  hooks.set({});
  sidebarItems.set({});
  siteNavLinks.set([]);
  lifecycleHandlers.set({});
  // Clear sidebar cache on init
  sidebarLoadedCacheKeys.clear();
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

export async function executeSidebarLoad(sidebarId, event) {
  // Execute lifecycle so plugins can register their items
  await executeLifecycle(`theme:sidebar:${sidebarId}:load`, {}, event);

  // Generate current plugin cache key (lazy)
  const freshPluginCacheKey = generatePluginCacheKey();

  // Check if sidebar is already loaded with current plugin set
  const cachedKey = sidebarLoadedCacheKeys.get(sidebarId);
  if (cachedKey === freshPluginCacheKey && freshPluginCacheKey !== "") {
    // Cache is valid, return current items
    return get(sidebarItems)[sidebarId] || [];
  }

  // Get current sidebar items
  const items = get(sidebarItems)[sidebarId] || [];

  // Resolve any viewComponent functions
  const resolvedItems = await Promise.all(
    items.map(async (item) => {
      if (typeof item.component === 'function' && !item.component.prototype) {
        try {
          const module = await item.component();
          return {
            ...item,
            component: module
          };
        } catch (e) {
          console.error(`[Sidebar:${sidebarId}] Failed to load component ${item.id}`, e);
          return item;
        }
      }
      return item;
    })
  );

  // Update the store with resolved components
  sidebarItems.update(current => {
    return {
      ...current,
      [sidebarId]: resolvedItems
    };
  });

  // Mark as loaded with current plugin cache key
  sidebarLoadedCacheKeys.set(sidebarId, freshPluginCacheKey);

  return resolvedItems;
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
    sidebar: {
      register(options) {
        const { sidebarId, id, component, priority = 10 } = options;
        sidebarItems.update(items => {
          if (!items[sidebarId]) items[sidebarId] = [];
          const existingIdx = items[sidebarId].findIndex(i => i.id === id);
          if (existingIdx !== -1) {
            items[sidebarId][existingIdx] = { ...items[sidebarId][existingIdx], component, priority };
          } else {
            items[sidebarId].push({ id, component, priority, hidden: false });
          }
          return items;
        });
      },
      hide(sidebarId, id) {
        sidebarItems.update(items => {
          if (!items[sidebarId]) return items;
          const item = items[sidebarId].find(i => i.id === id);
          if (item) item.hidden = true;
          return items;
        });
      },
      show(sidebarId, id) {
        sidebarItems.update(items => {
          if (!items[sidebarId]) return items;
          const item = items[sidebarId].find(i => i.id === id);
          if (item) item.hidden = false;
          return items;
        });
      },
      move(sidebarId, id, priority) {
        sidebarItems.update(items => {
          if (!items[sidebarId]) return items;
          const item = items[sidebarId].find(i => i.id === id);
          if (item) item.priority = priority;
          return items;
        });
      },
      get(sidebarId) {
        return derived(sidebarItems, $items => {
          return ($items[sidebarId] || [])
            .filter(item => !item.hidden)
            .sort((a, b) => b.priority - a.priority);
        });
      },
      onLoad(sidebarId, handler) {
        panoApi.ui.lifecycle.on(`theme:sidebar:${sidebarId}:load`, handler);
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
