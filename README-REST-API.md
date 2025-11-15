# 📚 REST API Documentation - Campus Food Sharing

## 🌐 Base URL

```
http://localhost:3000/api/v1
```

> **⚠️ Importante**: Todos los endpoints REST tienen el prefijo `/api/v1/`

---

## 🔐 Autenticación

La API utiliza **JWT (JSON Web Tokens)** para autenticación. Después del login o signup, incluye el token en el header `Authorization`:

```
Authorization: Bearer <tu_token_jwt>
```

### Compatibilidad con GraphQL
El token JWT es **compatible entre REST y GraphQL**. Un token generado en GraphQL funciona en REST y viceversa.

---

## 📋 Índice de Endpoints

- [🔑 Auth](#-auth)
- [👥 Users](#-users)
- [🛒 Products](#-products)
- [📦 Orders](#-orders)
- [👨‍💼 Sellers](#-sellers)

---

## 🔑 Auth

### 1. Registro de Usuario

**POST** `/api/v1/auth/signup`

Crea una nueva cuenta de usuario.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecureP@ss123"
}
```

**Validaciones:**
- `username`: string, mínimo 3 caracteres
- `email`: email válido
- `password`: string, mínimo 6 caracteres

**Response 201:**
```json
{
  "message": "Signup successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores:**
- `400`: Datos faltantes o inválidos
- `409`: El usuario ya existe

---

### 2. Login

**POST** `/api/v1/auth/login`

Inicia sesión y obtiene un token JWT.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecureP@ss123"
}
```

**Con 2FA (opcional):**
```json
{
  "email": "john@example.com",
  "password": "SecureP@ss123",
  "token": "123456"
}
```

**Response 200:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores:**
- `400`: Email y password requeridos
- `401`: Credenciales inválidas o token 2FA requerido

---

### 3. Obtener Perfil

**GET** `/api/v1/auth/profile`

🔒 **Requiere autenticación**

Obtiene el perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "user": {
    "id": "80af5f45-9ef0-4fb6-81ef-ae78bc6af5f7",
    "email": "john@example.com",
    "username": "john_doe",
    "role": "user",
    "twoFactorSecret": null,
    "twoFactorEnabled": false
  }
}
```

**Errores:**
- `401`: Token inválido o no proporcionado

---

### 4. Habilitar 2FA

**POST** `/api/v1/auth/2fa/enable`

🔒 **Requiere autenticación**

Genera un secreto y código QR para configurar autenticación de dos factores.

**Headers:**
```
Authorization: Bearer <token>
```

**Response 201:**
```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

---

### 5. Verificar y Activar 2FA

**POST** `/api/v1/auth/2fa/verify`

🔒 **Requiere autenticación**

Verifica el código TOTP y activa 2FA en la cuenta.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "token": "123456"
}
```

**Response 200:**
```json
{
  "message": "2FA enabled successfully"
}
```

---

### 6. Deshabilitar 2FA

**POST** `/api/v1/auth/2fa/disable`

🔒 **Requiere autenticación**

Desactiva 2FA en la cuenta del usuario.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "token": "123456"
}
```

**Response 200:**
```json
{
  "message": "2FA disabled successfully"
}
```

---

## 👥 Users

### 1. Listar Todos los Usuarios

**GET** `/api/v1/users`

🔒 **Requiere autenticación + rol: `admin`**

Obtiene la lista paginada de todos los usuarios.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (opcional): Número de resultados (default: 10)
- `offset` (opcional): Desplazamiento (default: 0)

**Ejemplo:** `/api/v1/users?limit=20&offset=0`

**Response 200:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user1@example.com",
    "username": "user1",
    "role": "user",
    "twoFactorEnabled": false,
    "products": [],
    "productsCount": 0
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "email": "admin@example.com",
    "username": "admin",
    "role": "admin",
    "twoFactorEnabled": true,
    "products": [],
    "productsCount": 0
  }
]
```

**Errores:**
- `401`: No autenticado
- `403`: No tiene rol de admin

---

### 2. Crear Usuario (Admin)

**POST** `/api/v1/users`

🔒 **Requiere autenticación + rol: `admin`**

Crea un usuario manualmente (solo admin).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "Password123",
  "role": "user"
}
```

**Validaciones:**
- `role`: Debe ser "user" o "admin"

**Response 201:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "email": "newuser@example.com",
  "username": "newuser",
  "role": "user",
  "twoFactorEnabled": false
}
```

**Errores:**
- `401`: No autenticado
- `403`: No tiene rol de admin
- `400`: Datos inválidos

---

### 3. Obtener Usuario por ID

**GET** `/api/v1/users/:id`

🔒 **Requiere autenticación**

Obtiene información de un usuario específico.

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "username": "user1",
  "role": "user",
  "twoFactorEnabled": false,
  "products": [
    {
      "id": "prod-123",
      "name": "Product 1",
      "price": 25.99,
      "stock": 10
    }
  ],
  "productsCount": 1
}
```

**Errores:**
- `401`: No autenticado
- `404`: Usuario no encontrado

---

### 4. Actualizar Usuario

**PUT** `/api/v1/users/:id`

🔒 **Requiere autenticación**

Actualiza información del usuario.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body (todos los campos opcionales):**
```json
{
  "username": "new_username",
  "email": "newemail@example.com"
}
```

**Response 200:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "newemail@example.com",
  "username": "new_username",
  "role": "user",
  "twoFactorEnabled": false
}
```

**Errores:**
- `401`: No autenticado
- `400`: Datos inválidos
- `404`: Usuario no encontrado

---

### 5. Eliminar Usuario

**DELETE** `/api/v1/users/:id`

🔒 **Requiere autenticación + rol: `admin`**

Elimina un usuario del sistema.

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "message": "User deleted successfully"
}
```

**Errores:**
- `401`: No autenticado
- `403`: No tiene rol de admin
- `404`: Usuario no encontrado

---

## 🛒 Products

### 1. Listar Todos los Productos

**GET** `/api/v1/products`

🌐 **Público** (no requiere autenticación)

Obtiene la lista paginada de todos los productos.

**Query Parameters:**
- `limit` (opcional): Número de resultados (default: 10)
- `offset` (opcional): Desplazamiento (default: 0)

**Ejemplo:** `/api/v1/products?limit=20&offset=0`

**Response 200:**
```json
[
  {
    "id": "prod-123",
    "name": "iPhone 15 Pro",
    "description": "Latest iPhone with A17 Pro chip",
    "price": 999.99,
    "stock": 50,
    "seller": {
      "id": "user-123",
      "username": "john_seller",
      "email": "john@example.com"
    }
  },
  {
    "id": "prod-456",
    "name": "MacBook Pro",
    "description": "M3 Max chip",
    "price": 2499.99,
    "stock": 20,
    "seller": {
      "id": "user-456",
      "username": "jane_seller",
      "email": "jane@example.com"
    }
  }
]
```

---

### 2. Obtener Producto por ID

**GET** `/api/v1/products/:id`

🌐 **Público** (no requiere autenticación)

Obtiene información detallada de un producto específico.

**Response 200:**
```json
{
  "id": "prod-123",
  "name": "iPhone 15 Pro",
  "description": "Latest iPhone with A17 Pro chip",
  "price": 999.99,
  "stock": 50,
  "seller": {
    "id": "user-123",
    "username": "john_seller",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Errores:**
- `404`: Producto no encontrado

---

### 3. Crear Producto

**POST** `/api/v1/products`

🔒 **Requiere autenticación**

Crea un nuevo producto. El usuario autenticado se convierte en el seller.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "iPhone 15 Pro",
  "description": "Latest iPhone with A17 Pro chip",
  "price": 999.99,
  "stock": 50
}
```

**Validaciones:**
- `name`: string, mínimo 3 caracteres (requerido)
- `description`: string (opcional)
- `price`: número, mínimo 0 (requerido)
- `stock`: número entero, mínimo 0 (opcional, default: 0)

**Response 201:**
```json
{
  "id": "prod-789",
  "name": "iPhone 15 Pro",
  "description": "Latest iPhone with A17 Pro chip",
  "price": 999.99,
  "stock": 50,
  "seller": {
    "id": "user-123",
    "username": "john_seller",
    "email": "john@example.com"
  }
}
```

**Errores:**
- `401`: No autenticado
- `400`: Datos inválidos

---

### 4. Actualizar Producto

**PUT** `/api/v1/products/:id`

🔒 **Requiere autenticación** (solo el dueño o admin)

Actualiza un producto existente.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body (todos los campos opcionales):**
```json
{
  "name": "iPhone 15 Pro Max",
  "description": "Updated description",
  "price": 1099.99,
  "stock": 45
}
```

**Response 200:**
```json
{
  "id": "prod-789",
  "name": "iPhone 15 Pro Max",
  "description": "Updated description",
  "price": 1099.99,
  "stock": 45,
  "seller": {
    "id": "user-123",
    "username": "john_seller",
    "email": "john@example.com"
  }
}
```

**Errores:**
- `401`: No autenticado
- `403`: No eres el dueño del producto ni admin
- `404`: Producto no encontrado
- `400`: Datos inválidos

---

### 5. Eliminar Producto

**DELETE** `/api/v1/products/:id`

🔒 **Requiere autenticación** (solo el dueño o admin)

Elimina un producto del sistema.

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "message": "Product deleted successfully"
}
```

**Errores:**
- `401`: No autenticado
- `403`: No eres el dueño del producto ni admin
- `404`: Producto no encontrado

---

## 📦 Orders

### 1. Crear Orden

**POST** `/api/v1/orders`

🔒 **Requiere autenticación**

Crea una nueva orden de compra. El stock se reduce automáticamente.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "550e8400-e29b-41d4-a716-446655440000",
      "quantity": 2
    },
    {
      "productId": "550e8400-e29b-41d4-a716-446655440001",
      "quantity": 1
    }
  ]
}
```

**Validaciones:**
- `items`: Array con al menos 1 item
- `productId`: UUID válido
- `quantity`: Número entero, mínimo 1

**Reglas de Negocio:**
- Valida stock disponible
- No puedes comprar tus propios productos
- El total se calcula automáticamente
- El stock se reduce al crear la orden
- Estado inicial: `pending`

**Response 201:**
```json
{
  "id": "order-123",
  "status": "pending",
  "total": 1299.97,
  "createdAt": "2025-11-15T10:30:00Z",
  "buyer": {
    "id": "user-456",
    "username": "buyer_user",
    "email": "buyer@example.com"
  },
  "items": [
    {
      "id": "item-1",
      "quantity": 2,
      "price": 399.99,
      "product": {
        "id": "prod-123",
        "name": "iPhone 15 Pro",
        "seller": {
          "id": "user-789",
          "username": "seller_user"
        }
      }
    },
    {
      "id": "item-2",
      "quantity": 1,
      "price": 499.99,
      "product": {
        "id": "prod-456",
        "name": "iPad Pro",
        "seller": {
          "id": "user-789",
          "username": "seller_user"
        }
      }
    }
  ]
}
```

**Errores:**
- `401`: No autenticado
- `400`: Items vacíos, stock insuficiente, o intentando comprar tu propio producto
- `404`: Producto no encontrado

---

### 2. Listar Todas las Órdenes (Admin)

**GET** `/api/v1/orders`

🔒 **Requiere autenticación + rol: `admin`**

Obtiene todas las órdenes del sistema (solo admin).

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
[
  {
    "id": "order-123",
    "status": "pending",
    "total": 999.99,
    "createdAt": "2025-11-15T10:30:00Z",
    "buyer": {
      "id": "user-456",
      "username": "buyer1"
    },
    "items": [...]
  },
  {
    "id": "order-456",
    "status": "delivered",
    "total": 1499.99,
    "createdAt": "2025-11-14T15:20:00Z",
    "buyer": {
      "id": "user-789",
      "username": "buyer2"
    },
    "items": [...]
  }
]
```

**Errores:**
- `401`: No autenticado
- `403`: No tiene rol de admin

---

### 3. Obtener Mis Órdenes

**GET** `/api/v1/orders/my-orders`

🔒 **Requiere autenticación**

Obtiene todas las órdenes creadas por el usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
[
  {
    "id": "order-123",
    "status": "pending",
    "total": 999.99,
    "createdAt": "2025-11-15T10:30:00Z",
    "buyer": {
      "id": "user-456",
      "username": "my_username",
      "email": "my@example.com"
    },
    "items": [
      {
        "id": "item-1",
        "quantity": 1,
        "price": 999.99,
        "product": {
          "id": "prod-123",
          "name": "iPhone 15 Pro",
          "seller": {
            "id": "user-789",
            "username": "seller_user"
          }
        }
      }
    ]
  }
]
```

**Errores:**
- `401`: No autenticado

---

### 4. Obtener Orden por ID

**GET** `/api/v1/orders/:id`

🔒 **Requiere autenticación**

Obtiene detalles de una orden específica.

**Permisos:**
- Buyer puede ver sus propias órdenes
- Seller puede ver órdenes que contienen sus productos
- Admin puede ver todas

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "id": "order-123",
  "status": "accepted",
  "total": 999.99,
  "createdAt": "2025-11-15T10:30:00Z",
  "buyer": {
    "id": "user-456",
    "username": "buyer_user",
    "email": "buyer@example.com"
  },
  "items": [
    {
      "id": "item-1",
      "quantity": 1,
      "price": 999.99,
      "product": {
        "id": "prod-123",
        "name": "iPhone 15 Pro",
        "description": "Latest iPhone",
        "seller": {
          "id": "user-789",
          "username": "seller_user",
          "email": "seller@example.com"
        }
      }
    }
  ]
}
```

**Errores:**
- `401`: No autenticado
- `403`: No tienes permiso para ver esta orden
- `404`: Orden no encontrada

---

### 5. Actualizar Estado de Orden

**PUT** `/api/v1/orders/:id/status`

🔒 **Requiere autenticación** (solo seller de productos en la orden o admin)

Actualiza el estado de una orden.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "accepted"
}
```

**Estados Válidos:**
- `pending`: Orden creada, esperando confirmación
- `accepted`: Vendedor aceptó la orden
- `delivered`: Orden entregada
- `canceled`: Orden cancelada

**Transiciones Válidas:**
- `pending` → `accepted`, `canceled`
- `accepted` → `delivered`, `canceled`
- `delivered` → (estado final)
- `canceled` → (estado final)

**Response 200:**
```json
{
  "id": "order-123",
  "status": "accepted",
  "total": 999.99,
  "createdAt": "2025-11-15T10:30:00Z",
  "buyer": {...},
  "items": [...]
}
```

**Errores:**
- `401`: No autenticado
- `403`: Solo sellers de productos en esta orden pueden actualizar el estado
- `404`: Orden no encontrada
- `400`: Transición de estado inválida

---

### 6. Cancelar Orden

**DELETE** `/api/v1/orders/:id`

🔒 **Requiere autenticación** (solo el buyer)

Cancela una orden y restaura el stock de productos.

**Restricciones:**
- Solo el buyer puede cancelar su propia orden
- Solo se puede cancelar si está en estado `pending`
- El stock se restaura automáticamente

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "id": "order-123",
  "status": "canceled",
  "total": 999.99,
  "createdAt": "2025-11-15T10:30:00Z",
  "buyer": {...},
  "items": [...]
}
```

**Errores:**
- `401`: No autenticado
- `403`: Solo puedes cancelar tus propias órdenes
- `404`: Orden no encontrada
- `400`: No se puede cancelar (no está en estado pending)

---

## 👨‍💼 Sellers

### 1. Listar Todos los Vendedores

**GET** `/api/v1/seller`

🌐 **Público** (no requiere autenticación)

Obtiene la lista paginada de usuarios que son vendedores (tienen productos).

**Query Parameters:**
- `limit` (opcional): Número de resultados (default: 10)
- `offset` (opcional): Desplazamiento (default: 0)

**Ejemplo:** `/api/v1/seller?limit=20&offset=0`

**Response 200:**
```json
[
  {
    "id": "user-123",
    "username": "seller1",
    "email": "seller1@example.com",
    "role": "user",
    "productsCount": 15,
    "products": [
      {
        "id": "prod-123",
        "name": "iPhone 15 Pro",
        "price": 999.99,
        "stock": 50
      }
    ]
  },
  {
    "id": "user-456",
    "username": "seller2",
    "email": "seller2@example.com",
    "role": "user",
    "productsCount": 8,
    "products": [...]
  }
]
```

---

### 2. Obtener Perfil de Vendedor

**GET** `/api/v1/seller/:id`

🌐 **Público** (no requiere autenticación)

Obtiene el perfil público de un vendedor, incluyendo sus productos e historial de ventas.

**Response 200:**
```json
{
  "id": "user-123",
  "username": "john_seller",
  "email": "john@example.com",
  "role": "user",
  "productsCount": 15,
  "products": [
    {
      "id": "prod-123",
      "name": "iPhone 15 Pro",
      "description": "Latest iPhone",
      "price": 999.99,
      "stock": 50
    },
    {
      "id": "prod-456",
      "name": "MacBook Pro",
      "description": "M3 Max chip",
      "price": 2499.99,
      "stock": 20
    }
  ]
}
```

**Errores:**
- `404`: Vendedor no encontrado

---

## 📝 Ejemplos de Uso

### Flujo Completo de Compra

#### 1. Registro de Usuario
```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "buyer1",
    "email": "buyer1@example.com",
    "password": "Password123"
  }'
```

**Response:**
```json
{
  "message": "Signup successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2. Ver Productos Disponibles
```bash
curl -X GET http://localhost:3000/api/v1/products?limit=10
```

#### 3. Crear una Orden
```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "items": [
      {
        "productId": "550e8400-e29b-41d4-a716-446655440000",
        "quantity": 2
      }
    ]
  }'
```

#### 4. Ver Mis Órdenes
```bash
curl -X GET http://localhost:3000/api/v1/orders/my-orders \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 5. Cancelar Orden (si está pending)
```bash
curl -X DELETE http://localhost:3000/api/v1/orders/order-123 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Flujo de Vendedor

#### 1. Crear Producto
```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "iPhone 15 Pro",
    "description": "Latest iPhone with A17 Pro chip",
    "price": 999.99,
    "stock": 50
  }'
```

#### 2. Actualizar Stock de Producto
```bash
curl -X PUT http://localhost:3000/api/v1/products/prod-123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "stock": 75
  }'
```

#### 3. Ver Orden de Cliente (si contiene tus productos)
```bash
curl -X GET http://localhost:3000/api/v1/orders/order-123 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 4. Aceptar Orden
```bash
curl -X PUT http://localhost:3000/api/v1/orders/order-123/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "status": "accepted"
  }'
```

#### 5. Marcar como Entregada
```bash
curl -X PUT http://localhost:3000/api/v1/orders/order-123/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "status": "delivered"
  }'
```

---

## 🔍 Swagger Documentation

La documentación interactiva de Swagger está disponible en:

```
http://localhost:3000/api-docs
```

Desde allí puedes:
- Ver todos los endpoints
- Probar las peticiones directamente
- Ver los esquemas de datos
- Autenticarte con JWT usando el botón "Authorize"

---

## ⚠️ Códigos de Error Comunes

| Código | Descripción | Solución |
|--------|-------------|----------|
| `400` | Bad Request - Datos inválidos | Verifica el formato del payload y las validaciones |
| `401` | Unauthorized - Token inválido o faltante | Incluye el header `Authorization: Bearer <token>` |
| `403` | Forbidden - Sin permisos | Verifica que tu rol tenga acceso al endpoint |
| `404` | Not Found - Recurso no encontrado | Verifica que el ID sea correcto |
| `409` | Conflict - Recurso ya existe | El email/username ya está registrado |
| `500` | Internal Server Error | Error del servidor, revisa los logs |

---

## 🔑 Seguridad

### Validaciones de Negocio

1. **Productos:**
   - Solo el dueño o admin puede actualizar/eliminar
   - No se puede crear con stock negativo
   - Precio debe ser mayor o igual a 0

2. **Órdenes:**
   - No puedes comprar tus propios productos
   - Se valida stock disponible antes de crear
   - Solo el buyer puede cancelar su orden (si está pending)
   - Solo el seller puede actualizar el estado
   - El stock se restaura al cancelar

3. **Usuarios:**
   - Solo admin puede ver todos los usuarios
   - Solo admin puede crear/eliminar usuarios manualmente
   - Las contraseñas se hashean con bcrypt
   - 2FA opcional con TOTP

---

## 📞 Soporte

Para más información sobre GraphQL, consulta `README-GRAPHQL.md`.

Para documentación interactiva, visita: `http://localhost:3000/api-docs`
