# Backend - Plataforma de Tutorías

API REST desarrollada con **Node.js**, **Express**, **Sequelize** y **MySQL** para soportar una plataforma de tutorías académicas. Gestiona autenticación, materias, tutores y sesiones de tutoría.

## Tecnologías utilizadas

- Node.js
- Express
- Sequelize
- MySQL
- JWT
- pnpm

## Funcionalidades

- Registro de usuarios.
- Inicio de sesión con autenticación JWT.
- Consulta del perfil autenticado.
- Listado de materias.
- Consulta de tutores por materia.
- Visualización del detalle de tutores.
- Creación de sesiones de tutoría.
- Consulta de sesiones del usuario autenticado.
- Actualización del estado de sesiones.
- Endpoint de verificación de estado del sistema.

## Estructura principal

```bash
Backend/
├── src/
│   ├── app.js
│   ├── config/
│   │   └── baseDatos.js
│   ├── controladores/
│   ├── middleware/
│   ├── modelos/
│   └── rutas/
├── package.json
└── README.md
```

## Requisitos previos

- Node.js 20 o superior
- pnpm 11.x
- MySQL 8 o compatible

## Base de datos

El proyecto utiliza una base de datos llamada:

```sql
Tutores_db
```

Puedes crearla manualmente con:

```sql
CREATE DATABASE Tutores_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Después puedes usar el archivo `Tablas.sql` del repositorio principal para crear la estructura inicial.

## Variables de entorno

Crea un archivo `.env` dentro de `Backend/` con una configuración similar a esta:

```env
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=Tutores_db
DB_USER=root
DB_PASSWORD=123456
JWT_SECRET=clave_super_segura
JWT_EXPIRES_IN=1d
DB_SYNC_ALTER=true
```

## Instalación

Desde la carpeta `Backend/`:

```bash
pnpm install
```

## Ejecución en desarrollo

```bash
pnpm dev
```

La API quedará disponible en:

```bash
http://localhost:4000
```

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `pnpm dev` | Ejecuta la API en desarrollo |
| `pnpm start` | Ejecuta la API en producción |

## Prefijo de la API

La API trabaja con el prefijo:

```bash
/api
```

## Endpoints principales

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/auth/register` | No | Registrar usuario |
| POST | `/auth/login` | No | Iniciar sesión |
| GET | `/auth/me` | Sí | Obtener perfil autenticado |
| GET | `/subjects` | No | Listar materias |
| GET | `/tutors` | No | Listar tutores |
| GET | `/tutors/:id` | No | Ver detalle de tutor |
| POST | `/sessions` | Sí | Crear sesión |
| GET | `/sessions/mine` | Sí | Consultar sesiones propias |
| PATCH | `/sessions/:id/status` | Sí | Actualizar estado de sesión |
| GET | `/health` | No | Verificar estado del servicio |

## Modelo de datos

El backend trabaja con una estructura basada en las siguientes tablas:

| Tabla | Descripción |
|---|---|
| `usuarios` | Información de usuarios registrados |
| `materias` | Asignaturas disponibles |
| `tutor_materias` | Relación entre tutores, materias y tarifa |
| `sesiones` | Registro de sesiones programadas |

## Estados de sesión

Las sesiones manejan los siguientes estados:

- `PENDING`
- `CONFIRMED`
- `CANCELLED`
- `COMPLETED`

## Notas de desarrollo

- La autenticación se realiza mediante JWT.
- Sequelize administra la comunicación con MySQL.
- La organización del proyecto sigue una separación por rutas, controladores, modelos y middleware.
- El valor `DB_SYNC_ALTER=true` puede usarse temporalmente durante cambios de esquema.

## Licencia

Proyecto académico con fines educativos.
