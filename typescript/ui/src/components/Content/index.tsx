import { CONTENT_MAP } from "./config";

interface ContentProps {
  href: string;
}

export function Content({ href }: ContentProps) {
  const entry = CONTENT_MAP[href];
  if (!entry) return null;
  const Component = entry.component;
  return <Component />;
}
