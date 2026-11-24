"use client";
/*
 * Runs a page's interactive scripts after it mounts and stops them when you leave the page.
 * Each script finds its own elements by data attribute and returns a cleanup function.
 */
import { useEffect } from "react";
import initCarousel from "@/lib/scripts/carousel";
import initExplainer from "@/lib/scripts/explainer";
import initForms from "@/lib/scripts/forms";
import initHiw from "@/lib/scripts/hiw";
import initJoin from "@/lib/scripts/join";

const SCRIPTS = { carousel: initCarousel, explainer: initExplainer, forms: initForms, hiw: initHiw, join: initJoin };
export type ScriptName = keyof typeof SCRIPTS;

export function PageScripts({ names }: { names: ScriptName[] }) {
  const key = names.join(",");
  useEffect(() => {
    const stops = key.split(",").map((n) => (SCRIPTS[n as ScriptName] as () => () => void)());
    return () => stops.forEach((stop) => stop());
  }, [key]);
  return null;
}
