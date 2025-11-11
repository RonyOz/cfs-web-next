# Campus Food Sharing — API Backend Specification

Última actualización: 2025-11-11

Esta especificación explica cómo usar los endpoints del backend `cfs-api-nest`. La API expone los recursos principales: autenticación, usuarios, productos, órdenes y un endpoint de seeds. Todas las rutas están prefijadas con `/api/v1` (ver `main.ts`).

Base URL (desarrollo):

- http://localhost:3000/api/v1

Contenido
- Autenticación (Auth)
- Usuarios (Users)
- Productos (Products)
- Órdenes (Orders)
- Seeds (Seed)
- Paginación
- Encabezados y formatos comunes
- Ejemplos (curl)

## Convenciones generales
- Todos los cuerpos de petición usan `Content-Type: application/json` salvo indicación contraria.
- Rutas prefix: `/api/v1` (ej.: `/api/v1/auth/login`).
- Autorización: JWT Bearer token en el encabezado `Authorization: Bearer <token>` para endpoints protegidos.
- Validación: usando `class-validator`. Ver mensajes de error 400/401/403/404 según cada endpoint.

## 1) Autenticación (Auth)
Ruta base: `/api/v1/auth`

1.1 POST /signup
- Descripción: Registrar un nuevo usuario.
- Acceso: público
- Body (JSON):
  - username: string (min 3)
  - email: string (email)
  - password: string (min 6)
- Respuesta 201:
  - { message: string, token: string }
- Errores: 400 (datos inválidos), 409 (usuario ya existe)

1.2 POST /login
- Descripción: Autenticar y obtener JWT. Si el usuario tiene 2FA activado, hay que enviar `token` TOTP.
- Acceso: público
- Body (JSON):
  - email: string
  - password: string
  - token?: string (TOTP de 6 dígitos, opcional si 2FA habilitado)
- Respuesta 200:
  - { message: string, token: string }
- Errores: 400 (datos incorrectos), 401 (credenciales inválidas / 2FA requerida)

1.3 POST /2fa/enable
- Descripción: Genera secret y QR para habilitar 2FA. Devuelve `secret` y `qrCode` (probablemente en base64 o URL para mostrar como imagen).
- Acceso: autenticado (Authorization header requerido)
- Body: ninguno
- Respuesta 201:
  - { secret: string, qrCode: string }
- Errores: 401

1.4 POST /2fa/verify
- Descripción: Verifica el código TOTP y activa 2FA en la cuenta.
- Acceso: autenticado
- Body (JSON):
  - token: string (6 dígitos)
- Respuesta 200:
  - { message: string }
- Errores: 400, 401

1.5 POST /2fa/disable
- Descripción: Desactiva 2FA en la cuenta (requiere verificar con token TOTP).
- Acceso: autenticado
- Body (JSON):
  - token: string
- Respuesta 200:
  - { message: string }
- Errores: 400, 401

1.6 GET /profile
- Descripción: Obtener perfil del usuario autenticado.
- Acceso: autenticado
- Respuesta 200:
  - { user: <UserEntity> }
- Errores: 401

---

## 2) Usuarios (Users)
Ruta base: `/api/v1/users`

2.1 GET /
- Descripción: Listar usuarios (admin only)
- Acceso: admin
- Query params (paginación opcional): `limit`, `offset`
- Respuesta 200: lista/paginación según implementación
- Errores: 401, 403

2.2 POST /
- Descripción: Crear usuario manualmente (admin)
- Acceso: admin
- Body (JSON): equivalente a `CreateUserDto`
  - username: string
  - email: string
  - password: string
  - role?: string (enum: ValidRoles — default: user)
- Respuesta 201: objeto `User`
- Errores: 400, 401, 403

2.3 GET /:id
- Descripción: Obtener usuario por ID (autenticado)
- Acceso: autenticado (se valida ownership o roles según servicio)
- Path params:
  - id: string (UUID)
- Respuesta 200: `User`
- Errores: 401, 404

2.4 PUT /:id
- Descripción: Actualizar usuario (autenticado)
- Acceso: autenticado
- Body (JSON): `UpdateUserDto` (campos opcionales: username, email, password, role)
- Respuesta 200: `User`
- Errores: 400, 401, 404

2.5 DELETE /:id
- Descripción: Eliminar usuario (admin only)
- Acceso: admin
- Respuesta 200: { message: 'User deleted successfully' }
- Errores: 401, 403, 404

---

## 3) Productos (Products)
Ruta base: `/api/v1/products`

3.1 GET /
- Descripción: Listar productos (público)
- Acceso: público
- Query params (paginación): `limit`, `offset`
- Respuesta 200: lista de productos

3.2 GET /:id
- Descripción: Obtener producto por ID (público)
- Acceso: público
- Path params:
  - id: string (UUID)
- Respuesta 200: `Product`
- Errores: 404

3.3 POST /
- Descripción: Crear producto (autenticado)
- Acceso: autenticado
- Body (JSON): `CreateProductDto`
  - name: string
  - description?: string
  - price: number
  - stock?: number
- Respuesta 201: `Product`
- Errores: 400, 401

3.4 PUT /:id
- Descripción: Actualizar producto (owner o admin)
- Acceso: autenticado (propietario del producto o admin)
- Body (JSON): `UpdateProductDto` (parcial)
- Respuesta 200: `Product`
- Errores: 400, 401, 403, 404

3.5 DELETE /:id
- Descripción: Eliminar producto (owner o admin)
- Acceso: autenticado (propietario o admin)
- Respuesta 200: { message: 'Product deleted successfully' }
- Errores: 401, 403, 404

---

## 4) Órdenes (Orders)
Ruta base: `/api/v1/orders`

4.1 POST /
- Descripción: Crear nueva orden (buyer)
- Acceso: autenticado
- Body (JSON): `CreateOrderDto`
  - items: Array of { productId: UUID, quantity: integer >= 1 }
- Comportamiento:
  - Valida stock
  - Calcula `total` automáticamente
  - Reduce stock de productos
  - No permite comprar tus propios productos
- Respuesta 201: objeto `Order` (estructura de la entidad con items, buyer, seller, total, status, createdAt...)
- Errores: 400 (items inválidos / stock insuficiente / intentar comprar propio producto), 401, 404 (producto no encontrado)

4.2 GET /
- Descripción: Obtener todas las órdenes (admin only)
- Acceso: admin
- Respuesta 200: lista de órdenes con información completa (buyers, sellers, items y productos)
- Errores: 401, 403

4.3 GET /:id
- Descripción: Obtener detalles de una orden
- Acceso: autenticado — el servicio valida acceso (buyer, seller involucrado o admin)
- Path params: id: UUID
- Respuesta 200: `Order` con items
- Errores: 401, 403, 404

4.4 PUT /:id/status
- Descripción: Actualizar estado de orden (seller de los productos en la orden o admin)
- Acceso: autenticado (seller o admin)
- Body (JSON): `UpdateOrderStatusDto` — { status: 'pending' | 'accepted' | 'delivered' | 'canceled' }
- Reglas: Validación de transiciones de estado dentro del servicio
- Respuesta 200: order actualizado
- Errores: 400 (transición inválida), 401, 403, 404

4.5 DELETE /:id
- Descripción: Cancelar orden (solo buyer, solo si está en 'pending')
- Acceso: autenticado (buyer)
- Respuesta 200: { message: 'Order canceled successfully and stock restored' }
- Errores: 400 (no se puede cancelar), 401, 403, 404

---

## 5) Seed (Seed)
Ruta base: `/api/v1/seed`

5.1 POST /run
- Descripción: Ejecuta el seeding de la base de datos (crea admin y productos ejemplo). Requiere autorización.
- Acceso: autenticado (en tu implementación actual requiere `@Auth()`)
- Body: ninguno
- Respuesta: depende del servicio, normalmente resumen de operaciones realizadas
- Nota: También puedes ejecutar localmente con el script `npm run seed` que ejecuta `src/seeds/seed-run.ts`.

---

## Paginación
- Query params usados por list endpoints:
  - `limit` (number, >0) — cantidad máxima de elementos (por defecto 10)
  - `offset` (number, >=0) — cuántos saltar (por defecto 0)

Ejemplo: `GET /api/v1/products?limit=20&offset=40`

---

## Encabezados y formatos comunes
- Content-Type: application/json
- Authorization: Bearer <JWT>

---

## Modelos resumidos (DTOs)
- CreateUserDto / SignupDto:
  - { username: string, email: string, password: string, role?: string }
- LoginDto:
  - { email: string, password: string, token?: string }
- CreateProductDto:
  - { name: string, description?: string, price: number, stock?: number }
- CreateOrderDto:
  - { items: [{ productId: string (UUID), quantity: number }] }
- UpdateOrderStatusDto:
  - { status: 'pending'|'accepted'|'delivered'|'canceled' }

---

## Ejemplos (curl)
(Reemplace `localhost:3000` y `<TOKEN>` por sus valores reales)

1) Registrar usuario

```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{ "username": "juan", "email": "juan@example.com", "password": "password123" }'
```

2) Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "juan@example.com", "password": "password123" }'
```

Respuesta esperada:
```json
{ "message": "Login successful", "token": "<JWT_TOKEN>" }
```

3) Obtener perfil (autenticado)

```bash
curl http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer <TOKEN>"
```

4) Crear producto (autenticado)

```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{ "name": "Sandwich", "description": "Delicious", "price": 3.5, "stock": 10 }'
```

5) Hacer una orden (buyer autenticado)

```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{ "items": [{ "productId": "550e8400-e29b-41d4-a716-446655440000", "quantity": 2 }] }'
```

6) Actualizar estado de orden (seller o admin)

```bash
curl -X PUT http://localhost:3000/api/v1/orders/<ORDER_ID>/status \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{ "status": "accepted" }'
```

7) Ejecutar seed desde local (script)

```bash
npm run seed
# o si usas bun: npm run seed:bun
```

---

## Errores comunes y códigos
- 400 Bad Request: validación fallida (body inválido, datos faltantes)
- 401 Unauthorized: token faltante o inválido, credenciales incorrectas
- 403 Forbidden: usuario autenticado sin rol/permiso necesario
- 404 Not Found: recurso no encontrado
- 409 Conflict: intento de crear recurso que ya existe (email/username duplicado)

---

## Notas y recomendaciones para el frontend
- Antes de llamar a endpoints protegidos, obtén y almacena el token JWT (por ejemplo en memory o en storage seguro). En cada llamada protegida añade `Authorization: Bearer <token>`.
- Para operaciones sensibles (2FA), validar la UX de QR + copy/paste para `secret` y permitir que el usuario introduzca el TOTP de 6 dígitos.
- Implementar manejo de paginación en listados con `limit`/`offset`.
- Para crear órdenes, mostrar la disponibilidad actual del stock para evitar errores por stock insuficiente.
- Usar la respuesta del endpoint de `create` para obtener los IDs recién creados y mostrar mensajes claros al usuario.

---

## Contacto y mantenimiento
Si encuentras discrepancias entre lo implementado y esta especificación, revisa los DTOs y los controladores en `src/modules/*` o abre un issue MR con la petición de cambio.

---

Fin de la especificación.
