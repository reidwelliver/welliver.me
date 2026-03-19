---
name: welliver.me personal website
description: Refrigerator word magnet website with real-time collaboration via MQTT, React frontend, Rust WASM state store, Azure hosting
type: project
---

Building a personal website that simulates refrigerator word magnets. Users drag magnets around and all connected users see movement in real-time via MQTT.

**Why:** Creative personal site that doubles as a portfolio/landing page with interactive word magnets.

**How to apply:** Monorepo with typescript/ui (React+Vite), rust/wasm (state store), and stack/ (Docker Compose). Backend is MQTT broker (self-hosted) + Azure Static Web App. dnd-kit for drag-and-drop. Grid-based layout optimized for 1920x1080.
