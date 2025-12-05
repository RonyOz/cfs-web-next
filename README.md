# Campus Food Sharing Frontend (Next.js) - Bocado

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)
![Zustand](https://img.shields.io/badge/Zustand-State-orange)
![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?logo=docker)

> **Note:**
> This web application was built with **Next.js 16** and aims to facilitate the buying and selling of food within a university campus, featuring JWT authentication, product and order management, designed with Tailwind CSS and global state management with Zustand.

---

## Authors

* David Artunduaga ([@David104087](https://github.com/David104087))
* Jennifer Castro ([@JenniferCastrocd](https://github.com/JenniferCastrocd))
* Rony Ordoñez ([@RonyOz](https://github.com/RonyOz))
* Juan de la Pava ([@JuanJDlp](https://github.com/JuanJDlp))

---

## Deployment

The application is deployed at the following link:

> [https://cfs-web-next.onrender.com](https://cfs-web-next.onrender.com)

**Backend API:**
> [https://cfs-api.onrender.com/api-docs](https://cfs-api.onrender.com/api-docs)

---

## Campus Food Sharing — Next.js

This repository includes a complete web application with **authentication**, **product management**, **shopping cart**, and **orders**, built with Next.js 16 App Router, TypeScript, Tailwind CSS v4, and Zustand for global state.

**Key Points:**

* Framework: Next.js 16 with App Router
* Styling: Tailwind CSS v4 with custom dark theme
* State: Zustand with localStorage persistence
* API Client: Axios with JWT interceptors
* Development port: `3001`
* Production port: `3000`

**How to run:**

1. Install dependencies:

   ```bash
   bun install
   # or
   npm install
   ```

2. Configure environment variables:

   ```bash
   cp .env.example .env.local
   ```

3. Start the development server:

   ```bash
   bun run dev
   # or
   npm run dev
   ```

4. Access the application:
   [http://localhost:3001](http://localhost:3001)

---

## Main Features

1. **JWT Authentication:** Login, registration, and session persistence with tokens.
2. **Product Management:** Complete CRUD with validations and role-based permissions.
3. **Shopping Cart:** Add products, modify quantities, and validate stock.
4. **Order Management:** Create, view, and cancel orders.
5. **Protected Routes:** Automatic redirection based on authentication state.
6. **Responsive Design:** Optimized for mobile, tablet, and desktop.
7. **Dark Theme:** Custom dark theme with mint green primary colors.
8. **Real-time Search:** Instant product filtering.
9. **Loading States:** Visual indicators for all async operations.
10. **Error Handling:** Centralized error handling with user messages.

---

## Tech Stack

* **Framework:** Next.js 16 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4
* **State Management:** Zustand
* **HTTP Client:** Axios
* **Forms:** React Hook Form + Zod
* **Icons:** Lucide React
* **Testing:** Jest + Playwright
* **Deployment:** Docker + Render

---

## Project Structure

```
src/
├── app/                    # App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   └── admin/             # Admin panel
├── components/            # Reusable components
│   ├── auth/             # Authentication components
│   ├── layout/           # Header, Footer, Navbar
│   ├── orders/           # Orders and cart
│   ├── products/         # Products
│   └── ui/               # Base UI components
├── lib/                   # Utilities and logic
│   ├── api/              # API client and endpoints
│   ├── hooks/            # Custom hooks
│   └── utils/            # Helper functions
├── store/                 # Zustand stores
└── types/                 # TypeScript types
```

---

## Getting Started

> **Tip:** Follow these steps to set up and run the project locally.

### 1. Prerequisites

* [Node.js](https://nodejs.org/) v20 or higher
* [Bun](https://bun.sh/) (recommended) or npm
* Backend API running at `https://cfs-api.onrender.com` or locally

### 2. Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=https://cfs-api.onrender.com/api/v1
NEXT_PUBLIC_ENVIRONMENT=development
```

### 3. Running

```bash
bun run dev
# or
npm run dev
```

The application will run at [http://localhost:3001](http://localhost:3001).

---

## Available Scripts

```bash
bun run dev          # Development (port 3001)
bun run build        # Production build
bun start            # Production server
bun test             # Unit tests
bun run test:e2e     # End-to-end tests
bun run lint         # Linter
```

---

## Testing

The application includes unit and end-to-end tests.

```bash
# Unit tests
bun test

# Coverage
bun run test:coverage

# E2E with Playwright
bun run test:e2e
```

---

## Docker

### Local build and execution

```bash
# Test Docker build
./scripts/docker-test.sh

# Clean up resources
./scripts/docker-cleanup.sh
```

### Deployment on Render

1. Connect your repository in Render Dashboard
2. Select "Docker" as runtime
3. Configure environment variables:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://cfs-api.onrender.com/api/v1
   NEXT_PUBLIC_ENVIRONMENT=production
   ```
4. Automatic deployment from `main` branch

---

## Routes Overview

<details>
<summary><strong>View main routes</strong></summary>

### Public

| Route        | Description                          |
| :----------- | :----------------------------------- |
| `/`          | Home page with products              |
| `/auth`      | Login and registration (tabs)        |

---

### Protected (Dashboard)

| Route                    | Description                     |
| :----------------------- | :------------------------------ |
| `/products`              | User product management         |
| `/products/new`          | Create new product              |
| `/products/{id}`         | Product detail                  |
| `/products/{id}/edit`    | Edit product                    |
| `/orders`                | Order history                   |
| `/orders/{id}`           | Order detail                    |
| `/profile`               | User profile                    |

---

### Admin

| Route            | Description              |
| :--------------- | :----------------------- |
| `/admin/users`   | User management          |
| `/admin/products`| All products             |
| `/admin/orders`  | All orders               |

</details>

---

## Key Technologies

### Zustand Stores

```typescript
// authStore - Authentication and user
// productStore - Products and CRUD
// orderStore - Orders and cart
```

### API Client

```typescript
// Axios with automatic interceptors:
// - JWT injection in headers
// - Error handling 401/403/500
// - Automatic logout on invalid token
```

### Tailwind Theme

```css
/* Custom colors */
--color-primary-400: #6BEFA3  /* Mint green */
--color-dark-900: #0E0E10     /* Main background */
--color-dark-800: #1A1A1D     /* Cards */
```

---

## Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is part of an academic work for the University.

---

Made with ❤️ for the university community
