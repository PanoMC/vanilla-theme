import { base } from '$app/paths';

const listeners = new Set();
let ws;
let shouldReconnect = false;
let reconnectTimer;
const RECONNECT_MS = 1000;
let wantSiteNotifications = false;

function buildWsUrl() {
  if (typeof window === 'undefined') return '';
  const withBase = `${base || ''}/api/ws`.replace(/\/+/g, '/');
  const path = withBase.startsWith('/') ? withBase : `/${withBase}`;
  const u = new URL(path, window.location.origin);
  u.protocol = u.protocol === 'https:' ? 'wss:' : 'ws:';
  return u.toString();
}

function scheduleReconnect() {
  if (!shouldReconnect || typeof window === 'undefined') {
    return;
  }
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
  }
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    if (shouldReconnect && wantSiteNotifications) {
      connect();
    }
  }, RECONNECT_MS);
}

function sendConfig() {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    return;
  }
  ws.send(JSON.stringify({ subscribeNotifications: true }));
}

function emitRefresh() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch {
      /* ignore */
    }
  });
}

function connect() {
  if (typeof window === 'undefined') {
    return;
  }
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
    return;
  }
  shouldReconnect = true;
  try {
    ws = new WebSocket(buildWsUrl());
  } catch {
    scheduleReconnect();
    return;
  }
  ws.onopen = () => {
    sendConfig();
  };
  ws.onmessage = (ev) => {
    let msg;
    try {
      msg = JSON.parse(ev.data);
    } catch {
      return;
    }
    if (msg.type === 'ready') {
      sendConfig();
      return;
    }
    if (msg.type === 'notificationRefresh' || msg.type === 'panelNotificationRefresh') {
      emitRefresh();
    }
  };
  ws.onclose = () => {
    ws = null;
    if (shouldReconnect && wantSiteNotifications) {
      scheduleReconnect();
    }
  };
  ws.onerror = () => {
    /* reconnect via onclose */
  };
}

function updateConnection() {
  if (typeof window === 'undefined') {
    return;
  }
  if (wantSiteNotifications) {
    if (!ws || ws.readyState === WebSocket.CLOSED) {
      connect();
    } else if (ws.readyState === WebSocket.OPEN) {
      sendConfig();
    }
  } else {
    shouldReconnect = false;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    if (ws) {
      try {
        ws.onopen = null;
        ws.onmessage = null;
        ws.onerror = null;
        ws.onclose = null;
        ws.close();
      } catch {
        /* ignore */
      }
      ws = null;
    }
  }
}

/**
 * Keep a WebSocket for the logged-in site session (nudges re-fetch of /api/notifications/quick).
 * @param {boolean} active
 */
export function setSiteNotificationsSubscription(active) {
  wantSiteNotifications = !!active;
  updateConnection();
}

/**
 * @param {() => void} fn
 * @returns {() => void} unsubscribe
 */
export function onNotificationRefresh(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
