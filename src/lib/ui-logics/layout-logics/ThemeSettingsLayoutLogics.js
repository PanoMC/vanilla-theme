import { onMount } from "svelte";
import { redirect } from "@sveltejs/kit";
import { writable } from "svelte/store";

import { goto } from "$app/navigation";

import { hasPermission, Permissions } from "$lib/auth.util";

function postHeight() {
  const h = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight
  );
  window.parent.postMessage({ type: "theme-iframe-height", height: h }, "*");
}

function postLoaded() {
  window.parent.postMessage({ type: "theme-settings-loaded" }, "*");
}

function postReady() {
  window.parent.postMessage({ type: "theme-settings-ready" }, "*");
}

export async function processLoad(event) {
  const { parent } = event;
  const parentData = await parent();
  const { user, siteInfo: { themeSettings } } = parentData;

  if (!hasPermission(Permissions.MANAGE_VIEW, user || {})) {
    throw redirect(302, "/");
  }

  return { themeSettings };
}

// First remove existing global styles
const removeExistingStyles = () => {
  // Find and remove all style tags (non-scoped ones)
  const existingStyles = Array.from(document.querySelectorAll('style'));
  existingStyles.forEach(style => {
    // Keep scoped styles (those with data-svelte-h attribute)
    // Keep panel-injected CSS
    // Remove global styles
    if (!style.hasAttribute('data-svelte-h') && style.id !== 'panel-injected-css') {
      console.log('Removing existing style:', style);
      style.remove();
    }
  });

  // Also remove CSS from link tags (but keep panel-injected ones)
  const cssLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  cssLinks.forEach(link => {
    // Keep panel-injected links
    if (link.getAttribute('data-panel-injected') === 'true') {
      return;
    }
    // Remove theme-specific CSS
    if (link.href && (link.href.includes('_app') || link.href.includes('theme'))) {
      console.log('Removing CSS link:', link.href);
      link.remove();
    }
  });
};

export function init() {
  const hidden = writable(true);

  onMount(async () => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', postLoaded);
    } else {
      // If already loaded, wait a bit and check again,
      postLoaded()
    }

    window.addEventListener("load", postHeight);
    window.addEventListener("resize", postHeight);
    
    // CSS inject and theme listener
    window.addEventListener("message", function(e) {
      if (e.data)
      console.log("Theme received message", e.data.type);

      if (e.data && e.data.type === "theme-iframe-ping") {
        postHeight();
      }
      
      // Message to set data-bs-theme
      if (e.data && e.data.type === "set-bs-theme" && e.data.theme) {
        console.log('Setting data-bs-theme to:', e.data.theme);
        document.documentElement.setAttribute('data-bs-theme', e.data.theme);
      }
      
      // CSS inject message (inline CSS from style tags)
      if (e.data && e.data.type === "inject-css" && e.data.css) {
        removeExistingStyles();
        console.log('Received inline CSS from panel:', e.data.css.substring(0, 100) + '...');
        
        // Clear previously injected CSS
        const existingInjectedStyle = document.getElementById('panel-injected-css');
        if (existingInjectedStyle) {
          console.log('Removing existing injected CSS');
          existingInjectedStyle.remove();
        }
        
        // Also clear existing global styles again (for security)
        const existingStyles = Array.from(document.querySelectorAll('style'));
        existingStyles.forEach(style => {
          if (!style.hasAttribute('data-svelte-h') && style.id !== 'panel-injected-css') {
            style.remove();
          }
        });
        
        // Add new CSS as style tag
        const style = document.createElement('style');
        style.id = 'panel-injected-css';
        style.textContent = e.data.css;
        document.head.appendChild(style);
        
        console.log('CSS injected successfully');
        
        // Update height after CSS is loaded
        setTimeout(() => {
          postHeight();
          postReady();
        }, 100);
      }
      
      // CSS links inject message (build mode - link tags)
      if (e.data && e.data.type === "inject-css-links" && e.data.links && Array.isArray(e.data.links)) {
        removeExistingStyles();
        console.log('Received CSS links from panel:', e.data.links);
        
        // Clear previously injected CSS links
        const existingInjectedLinks = Array.from(document.querySelectorAll('link[data-panel-injected="true"]'));
        existingInjectedLinks.forEach(link => link.remove());
        
        // Also clear existing global styles again (for security)
        const existingStyles = Array.from(document.querySelectorAll('style'));
        existingStyles.forEach(style => {
          if (!style.hasAttribute('data-svelte-h') && style.id !== 'panel-injected-css') {
            style.remove();
          }
        });
        
        // Add new CSS links
        let loadedCount = 0;
        const totalLinks = e.data.links.length;
        
        e.data.links.forEach((href, index) => {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = href;
          link.setAttribute('data-panel-injected', 'true');
          
          link.onload = () => {
            loadedCount++;
            if (loadedCount === totalLinks) {
              console.log('All CSS links loaded successfully');
              setTimeout(() => {
                postHeight();
                postReady();
              }, 100);
            }
          };
          
          link.onerror = () => {
            console.warn('Failed to load CSS link:', href);
            loadedCount++;
            if (loadedCount === totalLinks) {
              setTimeout(() => {
                postHeight();
                postReady();
              }, 100);
            }
          };
          
          document.head.appendChild(link);
        });
        
        console.log(`Injected ${totalLinks} CSS links`);
      }
    });

    const ro = new ResizeObserver(postHeight);
    ro.observe(document.body);

    if (typeof window !== "undefined" && window.top === window.self) {
      await goto("/");
      return;
    }

    hidden.set(false);

    document.body.classList.remove("bg-light");
  });

  return hidden;
}