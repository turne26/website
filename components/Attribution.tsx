"use client";
/* Keeps UTM tags and the ?ref= invite code from the landing page, for the signup. */
import { useEffect } from "react";

const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ref"];

export function Attribution() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const found: Record<string, string> = {};
      KEYS.forEach((k) => { const v = params.get(k); if (v) found[k] = v.slice(0, 120); });
      if (!Object.keys(found).length) return;
      const prev = JSON.parse(sessionStorage.getItem("turne_attr") || "{}");
      sessionStorage.setItem("turne_attr", JSON.stringify({ ...prev, ...found, landing: location.pathname }));
    } catch { /* storage blocked: signup still works, just without attribution */ }
  }, []);
  return null;
}
