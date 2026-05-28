# Genetec UI Assignment

A simple, clean, and maintainable React UI component library. This project focuses on delivering reusable components with a pragmatic approach to architecture.

## Design Philosophy

I chose a straightforward, flat architecture for this project. Instead of over-engineering with complex decoupling, I kept the components and the demo application simple. This approach ensures:

* **Readability:** The project structure is easy to navigate.
* **Maintainability:** Adding or modifying components is quick.
* **Focus:** The priority is on functional, clean UI code that does its job effectively.

## Why these choices?

* **Library and Examples Structure:** Even in a simple project, I separated the library (`/lib`) from the demo (`/examples`). This keeps the core logic clean and allows the library components to be independent of the demo application’s state.
* **Why Material UI (MUI)?** It is an industry standard for enterprise applications. It provides excellent accessibility and allows me to focus on building component logic rather than reinventing basic styling.
* **UI Abstraction:** I implemented a thin abstraction layer over MUI components to decouple the application from the underlying library. This approach allows for a minimal implementation that meets current requirements while remaining modular, making it straightforward to extend with additional props as the project grows.
* **State Management Strategy:** I prioritized simplicity and avoided overengineering by not using heavy libraries like Redux. I implemented a centralized approach to handle data, loading, and error states. This keeps the components clean, drastically reduces boilerplate code, and ensures consistent behavior across the application.
* **TypeScript:** I used TypeScript to ensure type safety. It catches potential errors at compile time and makes the API easier for other developers to consume.
* **Simple Build Setup:** I kept the configuration (Webpack/TSC) simple. It is reliable, standard, and avoids unnecessary complexity, making it easy for anyone to clone and run the project immediately.

## Project Structure

```text
├── lib/              # Core UI components  
├── examples/         # Demo application  
├── dist/             # Compiled production output  
└── package.json      # Dependencies and build scripts  
```
## Getting Started

### Prerequisites


* Node.js: >= 20.0.0
* npm: >= 10.0.0

### Setup


1. Install dependencies:
   `npm install`

2. Build the library:
   `npm run build`

3. Run the demo app:
   `npm start`

### Tech Stack

* React 19
* TypeScript
* Material UI (MUI)
* Webpack 5

