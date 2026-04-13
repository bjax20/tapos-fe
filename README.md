
# Tapos.work | Next.js Enterprise Frontend

A high-performance, production-ready frontend built with the [Next.js Enterprise Boilerplate](https://github.com/Blazity/next-enterprise). This project serves as the core user interface for the Tapos ecosystem, utilizing Next.js 15, Tailwind CSS v4, and a robust TypeScript architecture.

## 🚀 Quick Start (Local Development)

This project is configured to run on **port 4000** by default to avoid conflicts with standard backend services.

### Prerequisites

  * **Node.js**: 20.x or higher
  * **pnpm**: `corepack enable pnpm` (recommended)
  * **Backend API**: Ensure your NestJS API is running (typically on port 3000)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-repo/tapos-web.git
    cd tapos-web
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Environment Setup:**
    Create a `.env.development.local` file in the root directory:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
    NEXT_PUBLIC_APP_URL=http://localhost:4000
    ```

4.  **Run Development Server:**

    ```bash
    pnpm dev
    ```

    The application will be available at [http://localhost:4000](https://www.google.com/search?q=http://localhost:4000).

-----

## 🛠 Project Scripts

| Command | Action |
| :--- | :--- |
| `pnpm dev` | Starts the development server on **port 4000** with Turbopack. |
| `pnpm build` | Creates an optimized production build. |
| `pnpm lint` | Runs ESLint 9 to find and fix code style issues. |
| `pnpm test` | Executes the Vitest suite for unit and integration tests. |
| `pnpm storybook` | Launches Storybook on port 6006 for component development. |
| `pnpm analyze` | Builds the app and generates a bundle analysis report. |

-----

## 🏗 Key Architectural Decisions

### Authentication (HttpOnly Cookies)

We utilize a secure, stateless JWT authentication flow.

  * **Production**: Cookies are scoped to the `.tapos.work` domain to allow cross-subdomain access between the UI (`www.tapos.work`) and API (`api.tapos.work`).
  * **Development**: Cookies are set to `localhost` with `SameSite: Lax`.

### State Management & Data Fetching

  * **Server Components**: Leveraged for initial data fetching and SEO optimization.
  * **React Query / Hooks**: Used for client-side mutations (e.g., `useLogin`) and optimistic UI updates.

### Design System

  * **Tailwind CSS v4**: Utility-first styling with high-performance CSS-variable-based theming.
  * **Radix UI**: Accessible, headless primitives for complex components like Dialogs and Selects.
  * **Lucide React**: Consistent iconography across the platform.

-----

## 🔒 Security & Quality

  * **T3 Env**: Environment variables are strictly validated at runtime to prevent configuration errors.
  * **Middleware**: Protected routes (e.g., `/projects`) are guarded by Next.js Middleware which validates the `auth_token` cookie presence.
  * **Strict TypeScript**: Configured with `ts-reset` for improved type safety across standard library functions.

-----

## 🌐 Infrastructure

  * **Frontend**: Deployed on Vercel (Edge Runtime where applicable).
  * **Backend**: NestJS (Fastify) hosted on VPS

-----

