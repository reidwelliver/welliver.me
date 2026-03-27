import { useSyncExternalStore } from "react";

const MOBILE_BREAKPOINT = 768;
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

let mql: MediaQueryList | null = null;

function getMql() {
  if (!mql) mql = window.matchMedia(QUERY);
  return mql;
}

function subscribe(cb: () => void) {
  const m = getMql();
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}

function getSnapshot() {
  return getMql().matches;
}

function getServerSnapshot() {
  return false;
}

export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
