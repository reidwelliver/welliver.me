import "@welliver-me/frontend/style/index.scss";

import React from "react";
import { createRoot } from "react-dom/client";

import AppRoot from "./root";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<AppRoot />);
