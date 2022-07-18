const devUrlPort = ":7071";
const apiDirectory = "/api";

export default function getBaseUrl(): string {
  const { protocol, hostname } = window.location;
  const isDev = protocol === "http:";

  return `${protocol}//${hostname}${isDev ? devUrlPort : ""}${apiDirectory}`;
}
