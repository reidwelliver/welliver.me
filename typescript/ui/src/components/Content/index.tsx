import type { JSX } from "react";

import "./Content.css";
import { Rust } from "./Rust";
import { Typescript } from "./Typescript";
import { Linux } from "./Linux";
import { Desk } from "./Desk";
import { Cloud } from "./Cloud";
import { Airstream } from "./Airstream";
import { Radio } from "./Radio";
import { Travel } from "./Travel";
import { Robot } from "./Robot";
import { IoT } from "./IoT";

const CONTENT_MAP: Record<string, () => JSX.Element> = {
  "#rust": Rust,
  "#typescript": Typescript,
  "#react": Typescript,
  "#linux": Linux,
  "#desk": Desk,
  "#cloud": Cloud,
  "#airstream": Airstream,
  "#radio": Radio,
  "#travel": Travel,
  "#robot": Robot,
  "#IoT": IoT,
};

interface ContentProps {
  href: string;
}

export function Content({ href }: ContentProps) {
  const Component = CONTENT_MAP[href];
  if (!Component) return null;
  return <Component />;
}
