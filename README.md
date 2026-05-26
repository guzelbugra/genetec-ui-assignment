# UI Component Library Assignment

A minimalist, high-performance React component library designed for the Genetec technical assessment. Built from scratch using Webpack 5, TypeScript, and isolated CSS Modules.

## Architecture & Tech Stack

- **Core:** React 19 & TypeScript 6
- **Build System:** Webpack 5 (Custom configuration without using Create React App or Vite, made with low-level build knowledge)
- **Styling:** CSS Modules (Local class names)
- **Environment Isolation:** Dual-mode entrypoints. Development mode targets the local sandbox (`src/main.tsx`), while production mode compiles only the core library (`src/index.ts`).

## Getting Started

1. Install the project dependencies:
   npm install

2. Launch the local showcase / sandbox environment:
   npm start

3. Build the production-ready component package:
   npm run build

## Project Layout

- `src/components`: Core library components.
- `src/showcase`: Local playground to view and test components.
- `src/index.ts`: Public library entrypoint.
- `src/main.tsx`: Sandbox application entrypoint.
