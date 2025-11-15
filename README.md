# Campus Food Sharing Frontend (Next.js) - Bocado

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)
![Zustand](https://img.shields.io/badge/Zustand-State-orange)
![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?logo=docker)

> **Nota:**
> Esta aplicación web fue desarrollada con **Next.js 16** y tiene como propósito facilitar la compra y venta de alimentos dentro de un campus universitario, con autenticación JWT, gestión de productos y pedidos, diseñada con Tailwind CSS y estado global con Zustand.

---

## Autores

* David Artunduaga ([@David104087](https://github.com/David104087))
* Jennifer Castro ([@JenniferCastrocd](https://github.com/JenniferCastrocd))
* Rony Ordoñez ([@RonyOz](https://github.com/RonyOz))
* Juan de la Pava ([@JuanJDlp](https://github.com/JuanJDlp))

---

## Despliegue

La aplicación se encuentra desplegada en el siguiente enlace:

> [https://cfs-web-next.onrender.com](https://cfs-web-next.onrender.com)

**API Backend:**
> [https://cfs-api.onrender.com/api-docs](https://cfs-api.onrender.com/api-docs)

---

## Campus Food Sharing — Next.js

Este repositorio incluye una aplicación web completa con **autenticación**, **gestión de productos**, **carrito de compras** y **órdenes**, construida con Next.js 16 App Router, TypeScript, Tailwind CSS v4 y Zustand para el estado global.

**Puntos principales:**

* Framework: Next.js 16 con App Router
* Estilos: Tailwind CSS v4 con tema oscuro personalizado
* Estado: Zustand con persistencia en localStorage
* API Client: Axios con interceptores JWT
* Puerto desarrollo: `3001`
* Puerto producción: `3000`

**Cómo ejecutar:**

1. Instalar dependencias:

   ```bash
   bun install
   # o
   npm install
   ```

2. Configurar variables de entorno:

   ```bash
   cp .env.example .env.local
   ```

3. Iniciar el servidor en modo desarrollo:

   ```bash
   bun run dev
   # o
   npm run dev
   ```

4. Acceder a la aplicación:
   [http://localhost:3001](http://localhost:3001)

---

## Características Principales

1. **Autenticación JWT:** Login, registro y persistencia de sesión con tokens.
2. **Gestión de Productos:** CRUD completo con validaciones y permisos por rol.
3. **Carrito de Compras:** Añadir productos, modificar cantidades y validar stock.
4. **Gestión de Órdenes:** Crear, visualizar y cancelar pedidos.
5. **Protected Routes:** Redirección automática según estado de autenticación.
6. **Responsive Design:** Optimizado para móvil, tablet y desktop.
7. **Dark Theme:** Tema oscuro personalizado con colores primarios en verde menta.
8. **Real-time Search:** Filtrado instantáneo de productos.
9. **Loading States:** Indicadores visuales en todas las operaciones asíncronas.
10. **Error Handling:** Manejo centralizado de errores con mensajes al usuario.

---

## Stack Tecnológico

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

## Estructura del Proyecto

```
src/
├── app/                    # App Router pages
│   ├── (auth)/            # Rutas de autenticación
│   ├── (dashboard)/       # Rutas del dashboard
│   └── admin/             # Panel de administración
├── components/            # Componentes reutilizables
│   ├── auth/             # Componentes de autenticación
│   ├── layout/           # Header, Footer, Navbar
│   ├── orders/           # Órdenes y carrito
│   ├── products/         # Productos
│   └── ui/               # Componentes UI base
├── lib/                   # Utilidades y lógica
│   ├── api/              # Cliente API y endpoints
│   ├── hooks/            # Custom hooks
│   └── utils/            # Funciones auxiliares
├── store/                 # Zustand stores
└── types/                 # TypeScript types
```

---

## Puesta en Marcha

> **Tip:** Sigue estos pasos para configurar y ejecutar el proyecto localmente.

### 1. Prerrequisitos

* [Node.js](https://nodejs.org/) v20 o superior
* [Bun](https://bun.sh/) (recomendado) o npm
* API Backend corriendo en `https://cfs-api.onrender.com` o localmente

### 2. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=https://cfs-api.onrender.com/api/v1
NEXT_PUBLIC_ENVIRONMENT=development
```

### 3. Ejecución

```bash
bun run dev
# o
npm run dev
```

La aplicación se ejecutará en [http://localhost:3001](http://localhost:3001).

---

## Scripts Disponibles

```bash
bun run dev          # Desarrollo (puerto 3001)
bun run build        # Build de producción
bun start            # Servidor de producción
bun test             # Tests unitarios
bun run test:e2e     # Tests end-to-end
bun run lint         # Linter
```

---

## Pruebas

La aplicación cuenta con pruebas unitarias y end-to-end.

```bash
# Tests unitarios
bun test

# Coverage
bun run test:coverage

# E2E con Playwright
bun run test:e2e
```

---

## Docker

### Build y ejecución local

```bash
# Test Docker build
./scripts/docker-test.sh

# Limpiar recursos
./scripts/docker-cleanup.sh
```

### Despliegue en Render

1. Conecta tu repositorio en Render Dashboard
2. Selecciona "Docker" como runtime
3. Configura variables de entorno:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://cfs-api.onrender.com/api/v1
   NEXT_PUBLIC_ENVIRONMENT=production
   ```
4. Deploy automático desde la rama `main`

---

## Resumen de Rutas

<details>
<summary><strong>Ver rutas principales</strong></summary>

### Públicas

| Ruta         | Descripción                          |
| :----------- | :----------------------------------- |
| `/`          | Página principal con productos       |
| `/auth`      | Login y registro (tabs)              |

---

### Protegidas (Dashboard)

| Ruta                     | Descripción                     |
| :----------------------- | :------------------------------ |
| `/products`              | Gestión de productos del usuario |
| `/products/new`          | Crear nuevo producto            |
| `/products/{id}`         | Detalle de producto             |
| `/products/{id}/edit`    | Editar producto                 |
| `/orders`                | Historial de órdenes            |
| `/orders/{id}`           | Detalle de orden                |
| `/profile`               | Perfil de usuario               |

---

### Admin

| Ruta            | Descripción              |
| :-------------- | :----------------------- |
| `/admin/users`  | Gestión de usuarios      |
| `/admin/products` | Todos los productos    |
| `/admin/orders` | Todas las órdenes        |

</details>

---

## Tecnologías Clave

### Zustand Stores

```typescript
// authStore - Autenticación y usuario
// productStore - Productos y CRUD
// orderStore - Órdenes y carrito
```

### API Client

```typescript
// Axios con interceptores automáticos:
// - Inyección de JWT en headers
// - Manejo de errores 401/403/500
// - Logout automático en token inválido
```

### Tailwind Theme

```css
/* Colores personalizados */
--color-primary-400: #6BEFA3  /* Verde menta */
--color-dark-900: #0E0E10     /* Fondo principal */
--color-dark-800: #1A1A1D     /* Cards */
```

---

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## Licencia

Este proyecto es parte de un trabajo académico para la Universidad.

---

Hecho con ❤️ para la comunidad universitaria
