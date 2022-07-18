const devUrlExtension = ":7071/api";

export default function getBaseUrl(): string {
  const { protocol, hostname } = window.location;
  const isDev = protocol === "http:";

  return `${protocol}//${hostname}${isDev ? devUrlExtension : ""}`;
}
