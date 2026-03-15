# Bridges Web Interface - Agent Rules

## 1. Dev Server & Routing Reliability
- **Astro Server Cache:** Astro/Vite dev servers aggressively cache routes. When creating *new pages* (`src/pages/*.astro`), the dev server may return a `404 Not Found` if it fails to hot-reload the route registry.
- **WebGL SSR Fix:** Componentes de WebGL/Three.js (`@react-three/fiber`) não podem ser renderizados via SSR e farão o Vite crachar com o erro "reading 'call'". Eles *obrigam* a diretiva `<DrawbridgeMap client:only="react" />` para forçar a renderização client-side no nível do Astro.
- **Prevention:** ALWAYS verify if the route is accessible via `Invoke-WebRequest` after creation.
- **Correction:** If a 404 occurs on a newly created file, gracefully kill the dev server processes and restart cleanly:
  `Stop-Process -Name node -Force -ErrorAction SilentlyContinue; npm run dev`
- **Build Checks:** Always run `npm run build` after major route or component changes to ensure static generation completes without errors before deploying or testing.

## 2. Death Stranding Aesthetic Guidelines
- **Color Palette:**
  - Backgrounds: Kurobeni/Charcoal (`#261B1D`, `#3D3E40`) for a cold, hostile feel.
  - Text: Bleached Silk (`#F2F2F2`) for high-contrast readability.
  - Accents: Odradek Orange (`#dc8d18`) for warnings/calls to action, December Sky (`#D7D7D9`) for secondary info.
- **Typography:**
  - Headers: Geometric, tech-focused sans-serif (e.g., `Orbitron`, `Syncopate`).
  - Body: Clean, readable sans-serif (e.g., `Inter`).
  - Data/Status: VCR-like monospace (e.g., `Share Tech Mono`) styled in ALL CAPS.
- **UI Elements:**
  - **Minimalism:** Utilitarian, flat design. No rounded corners (`rounded-none`).
  - **Borders & Lines:** Use thin, solid borders (`border`, `border-b`) to simulate technical GUI panels and topographical map connections.
  - **Animations:** Use Framer Motion for deliberate, slow reveals (`duration: 0.6+`). Avoid bouncy or playful effects; stick to precise, mechanical fade-ins and line extensions.
  - **Backgrounds:** Incorporate subtle scanlines or topographical SVG overlays with low opacity (`opacity-10`) to enhance the Chiral Network digital aesthetic.

## 3. Data Architecture
- **Centralization:** RPG elements (Classes, Missions, Lore) MUST be decoupled from UI components.
- **Storage:** Store all arrays and interfaces in `src/data/*.ts`.
- **Typing:** Enforce strict TypeScript interfaces for all game entities to maintain reliability during rendering.

