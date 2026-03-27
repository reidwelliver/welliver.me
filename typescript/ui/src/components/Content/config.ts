import type { JSX } from "react";

import "./Content.css";
// import { Rust } from "./Rust";
import { Jobs } from "./Jobs";
// import { Linux } from "./Linux";
import { Desk } from "./Desk";
// import { Cloud } from "./Cloud";
import { Airstream } from "./Airstream";
import { Radio } from "./Radio";
import { Travel } from "./Travel";
// import { Robot } from "./Robot";
// import { IoT } from "./IoT";

interface ContentEntry {
  title: string;
  component: () => JSX.Element;
}

export const CONTENT_MAP: Record<string, ContentEntry> = {
  "#rust": { title: "Career History", component: Jobs },
  "#typescript": { title: "Career History", component: Jobs },
  "#react": { title: "Career History", component: Jobs },
  "#linux": { title: "Career History", component: Jobs },
  "#desk": { title: "desk", component: Desk },
  "#cloud": { title: "Career History", component: Jobs },
  "#airstream": {
    title: "The Restoration of my 1972 Airstream",
    component: Airstream,
  },
  "#radio": { title: "radio", component: Radio },
  "#travel": { title: "travel", component: Travel },
  "#robot": { title: "Career History", component: Jobs },
  "#IoT": { title: "Career History", component: Jobs },
};

export function getContentTitle(href: string): string | undefined {
  return CONTENT_MAP[href]?.title;
}
