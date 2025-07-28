# E-commerce API

Una API REST completa para un sistema de e-commerce desarrollada con NestJS, TypeScript y PostgreSQL.

## 🚀 Características Principales

- **Autenticación y Autorización**: JWT + Auth0 integration
- **Gestión de Usuarios**: Registro, login, perfiles y roles (Admin/User)
- **Catálogo de Productos**: CRUD completo con categorías e imágenes
- **Sistema de Pedidos**: Creación y gestión de órdenes con validación de stock
- **Carga de Archivos**: Integración con Cloudinary para imágenes de productos
- **Base de Datos**: PostgreSQL con TypeORM
- **Documentación**: Swagger/OpenAPI integrado
- **Seeding**: Sistema automático de poblado de datos iniciales

## 🛠️ Stack Tecnológico

- **Framework**: NestJS
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL
- **ORM**: TypeORM
- **Autenticación**: JWT + Auth0
- **Validación**: class-validator
- **Documentación**: Swagger/OpenAPI
- **Almacenamiento**: Cloudinary (imágenes)
- **Middleware**: Logger personalizado

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- PostgreSQL
- npm o yarn

## ⚙️ Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/LautaroFMartinez/ecommerce-api
cd ecommerce-api
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear un archivo `.env.development` en la raíz del proyecto:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_DATABASE=pm4be_lm

# JWT
JWT_SECRET_KEY=tu_secret_key_aqui

# Auth0
AUTH0_SECRET=tu_auth0_secret
AUTH0_AUDIENCE=tu_auth0_audience
AUTH0_CLIENT_ID=tu_auth0_client_id
AUTH0_BASE_URL=tu_auth0_base_url

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Server
PORT=3000
```

4. **Ejecutar migraciones (si las hay)**
```bash
npm run migration:run
```

5. **Iniciar la aplicación**
```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod
```

## 🔗 Endpoints Principales

### Autenticación
- `POST /auth/signup` - Registro de usuario
- `POST /auth/signin` - Inicio de sesión

### Usuarios
- `GET /users` - Listar usuarios (Admin)
- `GET /users/:id` - Obtener usuario por ID
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id/deactivate` - Desactivar usuario (Admin)

### Productos
- `GET /products` - Listar productos con paginación
- `GET /products/:id` - Obtener producto por ID
- `PUT /products/:id` - Actualizar producto (Admin)
- `GET /products/seeder` - Poblar productos iniciales

### Categorías
- `GET /categories` - Listar categorías
- `GET /categories/seeder` - Poblar categorías iniciales

### Pedidos
- `POST /orders` - Crear pedido
- `GET /orders/:id` - Obtener pedido por ID

### Archivos
- `POST /files/uploadImage/:id` - Subir imagen de producto

### Sistema
- `GET /health` - Health check
- `POST /seed-database` - Poblar base de datos
- `POST /reset-database` - Reiniciar base de datos
- `GET /check-database` - Verificar estado de la base de datos

## 📖 Documentación API

La documentación completa está disponible en Swagger:
```
http://localhost:3000/api
```

## 🗂️ Estructura del Proyecto

```
src/
├── config/              # Configuraciones (DB, Auth0, Cloudinary, etc.)
├── data/                # Datos de seeding
├── middleware/          # Middleware personalizado
├── modules/
│   ├── auth/           # Autenticación y autorización
│   ├── categories/     # Gestión de categorías
│   ├── files/          # Carga de archivos
│   ├── filters/        # Filtros de excepciones
│   ├── orders/         # Gestión de pedidos
│   ├── products/       # Gestión de productos
│   ├── seeder/         # Sistema de seeding
│   └── users/          # Gestión de usuarios
├── app.controller.ts   # Controlador principal
├── app.module.ts       # Módulo principal
└── main.ts            # Punto de entrada
```

## 🔐 Roles y Permisos

### Usuario Regular
- Ver productos y categorías
- Crear y ver sus propios pedidos
- Actualizar su perfil

### Administrador
- Todas las funciones de usuario regular
- Gestionar usuarios (ver todos, desactivar)
- Actualizar productos
- Acceso a endpoints administrativos

## 📊 Base de Datos

### Entidades Principales
- **Users**: Información de usuarios
- **Products**: Catálogo de productos
- **Categories**: Categorías de productos
- **Orders**: Pedidos realizados
- **OrderDetails**: Detalles de pedidos con productos

### Relaciones
- Usuario → Múltiples Pedidos (1:N)
- Pedido → Un Detalle de Pedido (1:1)
- Detalle de Pedido → Múltiples Productos (N:M)
- Producto → Una Categoría (N:1)

## 🌱 Seeding

El sistema incluye datos de prueba que se cargan automáticamente:

```bash
# Poblar manualmente
POST /seed-database

# Reiniciar y poblar
POST /reset-database

# Verificar estado
GET /check-database
```

**Datos incluidos:**
- 4 categorías: smartphone, monitor, keyboard, mouse
- 12 productos distribuidos en las categorías
- Usuario admin por defecto (si se configura)

## 🚦 Validaciones

- **Usuarios**: Email único, contraseñas seguras, campos requeridos
- **Productos**: Stock disponible, precios positivos
- **Pedidos**: Validación de stock antes de crear pedidos
- **Archivos**: Tipos permitidos (JPG, PNG, WebP), tamaño máximo 200KB

## 🔒 Seguridad

- Autenticación JWT
- Validación de roles
- Sanitización de datos de entrada
- Manejo seguro de contraseñas (bcrypt)
- Middleware de logging para auditoría

## 📝 Scripts Disponibles

```bash
npm run build          # Compilar aplicación
npm run start          # Iniciar aplicación
npm run start:dev      # Iniciar en modo desarrollo
npm run start:debug    # Iniciar en modo debug
npm run start:prod     # Iniciar en modo producción
npm run lint           # Ejecutar linter
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 👥 Autor

Lautaro F. Martinez - [contact@lfm.com.ar](mailto:contact@lfm.com.ar)

## 🐛 Reporte de Bugs

Si encuentras algún bug, por favor crea un issue en el repositorio de GitHub.

---

⭐️ Si este proyecto te fue útil, ¡no olvides darle una estrella!