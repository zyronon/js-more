// ==UserScript==
// @name         Fetch ChatGPT Conversations
// @namespace    https://tampermonkey.net/
// @version      1.0.0
// @description  按 100 分页拉取，直到 items 为空
// @match        https://chatgpt.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      chatgpt.com
// ==/UserScript==

(function () {
  "use strict";

  const BASE_URL = "https://chatgpt.com/backend-api/conversations";
  const PAGE_SIZE = 100; // limit 必须整百
  const SESSION_URL = "https://chatgpt.com/api/auth/session";

  function buildUrl(offset, limit) {
    const params = new URLSearchParams({
      offset: String(offset),
      limit: String(limit),
      order: "updated",
      is_archived: "false",
      is_starred: "false",
    });
    return `${BASE_URL}?${params.toString()}`;
  }

  function pickItems(payload) {
    if (!payload || typeof payload !== "object") return [];
    if (Array.isArray(payload.items)) return payload.items;
    if (Array.isArray(payload.conversations)) return payload.conversations;
    if (Array.isArray(payload.data)) return payload.data;
    return [];
  }

  function gmRequest(options) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        ...options,
        onload: resolve,
        onerror: reject,
        ontimeout: reject,
      });
    });
  }

  async function getAccessToken() {
    const res = await gmRequest({
      method: "GET",
      url: SESSION_URL,
      responseType: "json",
      withCredentials: true,
      headers: {
        accept: "application/json",
      },
    });

    if (res.status < 200 || res.status >= 300) {
      throw new Error(`获取 accessToken 失败: ${res.status}`);
    }

    const body = res.response || JSON.parse(res.responseText || "{}");
    const token = body && body.accessToken;
    if (!token) {
      throw new Error("未拿到 accessToken，请先在浏览器登录 chatgpt.com");
    }
    return token;
  }

  function getDeviceId() {
    let did = GM_getValue("oai_device_id", "");
    if (!did) {
      did =
        (typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID()) ||
        `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      GM_setValue("oai_device_id", did);
    }
    return did;
  }

  async function requestPage(offset, limit, authHeaders) {
    if (limit % 100 !== 0) {
      throw new Error(`limit=${limit} 非整百，接口会拒绝`);
    }

    const res = await gmRequest({
      method: "GET",
      url: buildUrl(offset, limit),
      responseType: "json",
      withCredentials: true,
      headers: {
        accept: "application/json",
        ...authHeaders,
      },
    });

    if (res.status < 200 || res.status >= 300) {
      throw new Error(`请求失败: ${res.status} | ${res.responseText || ""}`);
    }

    return res.response || JSON.parse(res.responseText || "{}");
  }

  async function fetchAllConversations() {
    const token = await getAccessToken();
    const deviceId = getDeviceId();
    const authHeaders = {
      authorization: `Bearer ${token}`,
      "oai-device-id": deviceId,
    };

    const all = [];
    for (let offset = 0; ; offset += PAGE_SIZE) {
      const payload = await requestPage(offset, PAGE_SIZE, authHeaders);
      const pageItems = pickItems(payload);

      if (pageItems.length === 0) {
        console.log(`[TM] offset=${offset} 返回空数组，停止分页`);
        break;
      }

      all.push(...pageItems);
      console.log(`[TM] 已获取页 offset=${offset}，本页 ${pageItems.length} 条，累计 ${all.length} 条`);
    }

    const dedupMap = new Map();
    for (const item of all) {
      const id = item && item.id ? item.id : `__no_id__${Math.random()}`;
      if (!dedupMap.has(id)) dedupMap.set(id, item);
    }

    const conversations = [...dedupMap.values()];
    const titles = conversations
      .map((item) => (item && typeof item.title === "string" ? item.title : ""))
      .filter(Boolean);

    return { count: conversations.length, titles, conversations };
  }

  (async () => {
    try {
      const result = await fetchAllConversations();
      console.log(`[TM] 拉取完成: 实际条数=${result.count}, 标题数=${result.titles.length}`);
      console.log("[TM] titles:", result.titles);
      // 如果需要下载，可自行加下载逻辑。
      // window.__chatgptConversations = result;
    } catch (error) {
      console.error("[TM] 失败:", error);
    }
  })();
})();
