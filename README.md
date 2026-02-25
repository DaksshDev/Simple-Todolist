# Firelist

Minimal Vercel‑styled task board built with **React**, **Vite**, **Tailwind CSS**, and **canvas‑confetti**.  
You can create groups, lists, and tasks, drag cards between lists, drop into **Done** for colorful confetti, and tag tasks with colored labels that persist in `localStorage`.

## Getting started

### 1. Install dependencies

From the project root:

```bash
npm install
```

### 2. Run the dev server

```bash
npm run dev
```

Then open the URL Vite prints in the terminal (by default `http://localhost:3000`).

### 3. Build for production

```bash
npm run build
```

This outputs an optimized static bundle in `dist/` which you can deploy to any static host.

## Features

- **Vercel‑like dark UI** with a centered Firelist header.
- **Groups & lists**: accordion groups with per‑group list creation, drag‑to‑reorder lists.
- **Tasks with tags**: add tasks via modal, type tags and confirm with a comma to turn them into removable chips.
- **Done column**: works like a normal list, but dropping cards here shows a green tick pill and fires colorful confetti.
- **Persistence**: groups, lists, and tasks are stored in `localStorage`, so they survive refreshes.
