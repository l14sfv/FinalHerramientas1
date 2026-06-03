# Plataforma de Tutorías

Aplicación full stack para conectar **estudiantes** con **tutores** académicos: buscar por materia, ver tarifas por hora, agendar sesiones y contactar por WhatsApp.

Cada parte del proyecto vive en su propia carpeta con dependencias independientes (`Backend/` y `Frontend/`). No hay instalación ni `node_modules` en la raíz.

## Estructura

```
Arqfinal/
├── Backend/          API REST (Node, Express, Sequelize, MySQL)
├── Frontend/         SPA (React, Vite, React Router)
├── .gitignore
└── README.md
```

## Stack

| Capa      | Tecnología                                      |
|-----------|-------------------------------------------------|
| Backend   | Node.js, Express, Sequelize, MySQL, JWT         |
| Frontend  | React 19, Vite, React Router, Axios             |
| Paquetes  | **pnpm** (en `Backend/` y `Frontend/` por separado) |

## Requisitos

- Node.js 20+
- [pnpm](https://pnpm.io/installation) 11.x
- MySQL 8+ (o compatible)

## Instalación

### 1. Base de datos

Crea la base de datos en MySQL:

```sql
CREATE DATABASE Tutores_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend

```bash
cd Backend
cp .env.example .env    # Windows: copy .env.example .env
pnpm install
pnpm dev
```

La API queda en `http://localhost:4000`.

### 3. Frontend

En otra terminal:

```bash
cd Frontend
cp .env.example .env    # Windows: copy .env.example .env
pnpm install
pnpm dev
```

La app queda en `http://localhost:5173` (puerto por defecto de Vite).

## Variables de entorno

### Backend (`Backend/.env`)

| Variable         | Descripción                          | Ejemplo        |
|------------------|--------------------------------------|----------------|
| `PORT`           | Puerto del servidor                  | `4000`         |
| `DB_HOST`        | Host MySQL                           | `127.0.0.1`    |
| `DB_PORT`        | Puerto MySQL                         | `3306`         |
| `DB_NAME`        | Nombre de la BD                      | `Tutores_db`   |
| `DB_USER`        | Usuario MySQL                        | `root`         |
| `DB_PASSWORD`    | Contraseña MySQL                     | `****`         |
| `JWT_SECRET`     | Secreto para tokens JWT              | cadena larga   |
| `JWT_EXPIRES_IN` | Expiración del token                 | `1d`           |
| `DB_SYNC_ALTER`  | `true` una vez para añadir columnas nuevas al esquema | `true` |

### Frontend (`Frontend/.env`)

| Variable                 | Descripción                              | Ejemplo          |
|--------------------------|------------------------------------------|------------------|
| `VITE_WHATSAPP_SUPPORT`  | WhatsApp de soporte (código país + número) | `573001234567` |

## Scripts útiles

**Backend** (desde `Backend/`):

| Comando       | Acción                    |
|---------------|---------------------------|
| `pnpm dev`    | API con nodemon           |
| `pnpm start`  | API en modo producción    |

**Frontend** (desde `Frontend/`):

| Comando          | Acción              |
|------------------|---------------------|
| `pnpm dev`       | Servidor de desarrollo |
| `pnpm build`     | Build de producción |
| `pnpm preview`   | Previsualizar build |
| `pnpm lint`      | ESLint              |

## API REST

Prefijo: `/api`

| Método | Ruta                        | Auth | Descripción                    |
|--------|-----------------------------|------|--------------------------------|
| POST   | `/auth/register`            | No   | Registro (estudiante o tutor)  |
| POST   | `/auth/login`               | No   | Login → JWT                    |
| GET    | `/auth/me`                  | Sí   | Perfil del usuario             |
| GET    | `/subjects`                 | No   | Listar materias                |
| POST   | `/subjects`                 | Admin| Crear materia                  |
| GET    | `/tutors`                   | No   | Listar tutores (`?subjectId=`) |
| GET    | `/tutors/:id`               | No   | Detalle tutor + tarifas        |
| POST   | `/sessions`                 | Sí   | Crear sesión (estudiante)      |
| GET    | `/sessions/mine`            | Sí   | Sesiones del usuario           |
| PATCH  | `/sessions/:id/status`      | Sí   | Cambiar estado (tutor/admin)   |

| GET    | `/health`                   | No   | Estado de BD y conteo de usuarios |

## Roles y flujo

- **Estudiante**: busca tutores, agenda sesiones, escribe por WhatsApp al tutor.
- **Tutor**: debe registrar WhatsApp al darse de alta; confirma, cancela o completa sesiones.
- **Admin**: acceso ampliado (p. ej. crear materias, ver todas las sesiones).

Estados de sesión: `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`.

## Estructura del código

### Backend (`Backend/src/`)

```
src/
├── app.js
├── config/baseDatos.js
├── modelos/          Usuario, Materia, TutorMateria, Sesion
├── controladores/    autenticacion, materias, tutores, sesiones, salud
├── rutas/            autenticacion, materias, tutores, sesiones
└── middleware/       autenticacion, roles
```

### Frontend (`Frontend/src/`)

```
src/
├── paginas/          Inicio, IniciarSesion, Registro, Tutores, DetalleTutor, Sesiones
├── componentes/      BarraNavegacion, PiePagina, RutaProtegida, MensajeWhatsApp
├── contextos/        ContextoAutenticacion, ContextoNotificaciones
├── utilidades/       etiquetas, whatsapp
└── api/cliente.js
```

Las rutas URL del frontend siguen en inglés (`/login`, `/tutors`) por compatibilidad; los archivos fuente están en español.

## Modelo de datos (esquema en español)

| Tabla MySQL       | Uso                                      |
|-------------------|------------------------------------------|
| `usuarios`        | Estudiantes, tutores y admins (`rol`)    |
| `materias`        | Asignaturas                              |
| `tutor_materias`  | Materias del tutor + `precio_hora`       |
| `sesiones`        | Citas entre estudiante y tutor           |

No hay tabla `tutores` separada: un tutor es un registro en `usuarios` con `rol = 'TUTOR'`.

Columnas principales de `usuarios`: `nombre`, `email`, `contrasena`, `rol`, `telefono`.

### Consultar usuarios

```sql
USE Tutores_db;
SELECT id, nombre, email, rol, telefono FROM usuarios;
```

Verifica la conexión: `GET http://localhost:4000/api/health`

### Migrar datos de tablas en inglés

Si antes usaste tablas `users`, `subjects`, etc. y `usuarios` está vacía:

```bash
cd Backend
pnpm migrate:spanish
```

Copia los datos a las tablas en español una sola vez (solo si el destino está vacío).

## Notas de desarrollo

- El frontend consume la API en `http://localhost:4000/api` (ver `Frontend/src/api/client.js`).
- Si añades columnas al modelo, arranca el backend con `DB_SYNC_ALTER=true` una sola vez.
- Esquema BD en español; la API sigue respondiendo con nombres en inglés (`name`, `role`, etc.) para el frontend.
- Usa **pnpm** en cada carpeta; evita `npm install` por consistencia con los lockfiles existentes.

## Licencia

Proyecto académico / demo. Uso libre dentro del contexto del curso o equipo asignado.
