import { baseAPI, pageAPI } from "../pano-sdk/core/js/PluginAPI";
import { derived, get, writable } from "svelte/store";
import { plugins } from "../pano-sdk/core/js/PluginManager.js";
import { avatarVersion } from "./Store.js";

const hooks = writable({});
const uiItems = writable({});
const siteNavLinks = writable([]);

// Deduplicate items by id, keeping the last occurrence
function deduplicateById(arr) {
  const seen = new Map();
  for (const item of arr) {
    if (item.id) seen.set(item.id, item);
    else seen.set(Symbol(), item);
  }
  arr.length = 0;
  arr.push(...seen.values());
}

// Version-based UI caching using plugin IDs and versions
const uiLoadedCacheKeys = new Map(); // Map<containerId, pluginCacheKey>

function generatePluginCacheKey() {
  const loadedPlugins = get(plugins);
  if (!loadedPlugins || typeof loadedPlugins !== "object") {
    return "";
  }
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
  uiItems.set({});
  siteNavLinks.set([]);
  lifecycleHandlers.set({});
  uiLoadedCacheKeys.clear();
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
  await executeLifecycle(`theme:sidebar:${sidebarId}:load`, {}, event);
  return await executeComponentLoad(sidebarId, "Sidebar", event);
}

export async function executeViewLoad(viewId, event) {
  await executeLifecycle(`theme:view:${viewId}:load`, {}, event);
  return await executeComponentLoad(viewId, "View", event);
}

async function executeComponentLoad(containerId, type, event) {
  const freshPluginCacheKey = generatePluginCacheKey();

  // Cache check removed because UI items are dynamic and rebuilt on navigation

  const items = get(uiItems)[containerId] || [];

  const resolvedItems = await Promise.all(
    items.map(async (item) => {
      if (typeof item.component === "function" && !item.component.prototype) {
        try {
          const module = await item.component();
          return { ...item, component: module };
        } catch (e) {
          console.error(`[${type}:${containerId}] Failed to load component ${item.id}`, e);
          return item;
        }
      }
      return item;
    }),
  );

  uiItems.update((current) => ({ ...current, [containerId]: resolvedItems }));
  uiLoadedCacheKeys.set(containerId, freshPluginCacheKey);

  return resolvedItems;
}

export const panoApi = {
  ...baseAPI,
  ui: {
    ...pageAPI,
    nav: {
      site: {
        editNavLinks(callback) {
          siteNavLinks.update((links) => callback(links) || links);
        },
        getNavLinks() {
          return siteNavLinks;
        },
      },
      profileDropdown: {
        edit(callback) {
          uiItems.update((items) => {
            if (!items["navbar-profile-dropdown"]) items["navbar-profile-dropdown"] = [];
            callback(items["navbar-profile-dropdown"]);
            deduplicateById(items["navbar-profile-dropdown"]);
            return items;
          });
        },
        get() {
          return panoApi.ui.view.get("navbar-profile-dropdown");
        },
      },
      rightComponents: {
        edit(callback) {
          uiItems.update((items) => {
            if (!items["navbar-right"]) items["navbar-right"] = [];
            callback(items["navbar-right"]);
            deduplicateById(items["navbar-right"]);
            return items;
          });
        },
        get() {
          return panoApi.ui.view.get("navbar-right");
        },
      },
      onLoad(handler) {
        panoApi.ui.lifecycle.on("theme:navbar:load", handler);
      },
    },
    profile: {
      content: {
        edit(callback) {
          uiItems.update((items) => {
            if (!items["profile-content"]) items["profile-content"] = [];
            callback(items["profile-content"]);
            deduplicateById(items["profile-content"]);
            return items;
          });
        },
        get() {
          return panoApi.ui.view.get("profile-content");
        },
      },
      cardRows: {
        edit(callback) {
          uiItems.update((items) => {
            if (!items["profile-card-rows"]) items["profile-card-rows"] = [];
            callback(items["profile-card-rows"]);
            deduplicateById(items["profile-card-rows"]);
            return items;
          });
        },
        get() {
          return panoApi.ui.view.get("profile-card-rows");
        },
      },
      onLoad(handler) {
        panoApi.ui.lifecycle.on("theme:profile:load", handler);
      },
    },
    settings: {
      content: {
        edit(callback) {
          uiItems.update((items) => {
            if (!items["settings-content"]) items["settings-content"] = [];
            callback(items["settings-content"]);
            deduplicateById(items["settings-content"]);
            return items;
          });
        },
        get() {
          return panoApi.ui.view.get("settings-content");
        },
      },
      onLoad(handler) {
        panoApi.ui.lifecycle.on("theme:settings:load", handler);
      },
    },
    tickets: {
      content: {
        edit(callback) {
          uiItems.update((items) => {
            if (!items["tickets-content"]) items["tickets-content"] = [];
            callback(items["tickets-content"]);
            deduplicateById(items["tickets-content"]);
            return items;
          });
        },
        get() {
          return panoApi.ui.view.get("tickets-content");
        },
      },
      onLoad(handler) {
        panoApi.ui.lifecycle.on("theme:tickets:load", handler);
      },
    },
    auth: {
      login: {
        content: {
          edit(callback) {
            uiItems.update((items) => {
              if (!items["login-content"]) items["login-content"] = [];
              callback(items["login-content"]);
              deduplicateById(items["login-content"]);
              return items;
            });
          },
          get() {
            return panoApi.ui.view.get("login-content");
          },
        },
        onLoad(handler) {
          panoApi.ui.lifecycle.on("theme:login:load", handler);
        },
      },
      register: {
        content: {
          edit(callback) {
            uiItems.update((items) => {
              if (!items["register-content"]) items["register-content"] = [];
              callback(items["register-content"]);
              deduplicateById(items["register-content"]);
              return items;
            });
          },
          get() {
            return panoApi.ui.view.get("register-content");
          },
        },
        onLoad(handler) {
          panoApi.ui.lifecycle.on("theme:register:load", handler);
        },
      },
    },
    app: {
      onLoad(handler) {
        panoApi.ui.lifecycle.on("theme:app:load", handler);
      },
    },
    view: {
      register(options) {
        const { viewId, id, component, priority = 10 } = options;
        uiItems.update((items) => {
          if (!items[viewId]) items[viewId] = [];
          const existingIdx = items[viewId].findIndex((i) => i.id === id);
          if (existingIdx !== -1) {
            items[viewId][existingIdx] = {
              ...items[viewId][existingIdx],
              component,
              priority,
            };
          } else {
            items[viewId].push({ id, component, priority, hidden: false });
          }
          return items;
        });
      },
      hide(viewId, id) {
        uiItems.update((items) => {
          if (!items[viewId]) return items;
          const item = items[viewId].find((i) => i.id === id);
          if (item) item.hidden = true;
          return items;
        });
      },
      show(viewId, id) {
        uiItems.update((items) => {
          if (!items[viewId]) return items;
          const item = items[viewId].find((i) => i.id === id);
          if (item) item.hidden = false;
          return items;
        });
      },
      move(viewId, id, priority) {
        uiItems.update((items) => {
          if (!items[viewId]) return items;
          const item = items[viewId].find((i) => i.id === id);
          if (item) item.priority = priority;
          return items;
        });
      },
      get(viewId) {
        return derived(uiItems, ($items) => {
          return ($items[viewId] || [])
            .filter((item) => !item.hidden)
            .sort((a, b) => b.priority - a.priority);
        });
      },
      onLoad(viewId, handler) {
        panoApi.ui.lifecycle.on(`theme:view:${viewId}:load`, handler);
      },
    },
    sidebar: {
      register(options) {
        const { sidebarId, ...rest } = options;
        panoApi.ui.view.register({ viewId: sidebarId, ...rest });
      },
      hide(sidebarId, id) {
        panoApi.ui.view.hide(sidebarId, id);
      },
      show(sidebarId, id) {
        panoApi.ui.view.show(sidebarId, id);
      },
      move(sidebarId, id, priority) {
        panoApi.ui.view.move(sidebarId, id, priority);
      },
      get(sidebarId) {
        return panoApi.ui.view.get(sidebarId);
      },
      onLoad(sidebarId, handler) {
        panoApi.ui.lifecycle.on(`theme:sidebar:${sidebarId}:load`, handler);
      },
    },
    post: {
      onLoad(handler) {
        panoApi.ui.lifecycle.on("theme:post-detail:load", handler);
      },
    },
    support: {
      onLoad(handler) {
        panoApi.ui.lifecycle.on("theme:support:load", handler);
      },
    },
    lifecycle: {
      on(name, handler) {
        lifecycleHandlers.update((h) => {
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
    },
    avatar: {
      updateVersion() {
        avatarVersion.set(`&v=${Date.now()}`);
      },
    },
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
