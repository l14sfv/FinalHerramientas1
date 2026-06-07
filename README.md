# Plataforma de Tutorías

Aplicación web full stack para gestionar una plataforma de tutorías académicas. Permite registrar usuarios, iniciar sesión, consultar materias, visualizar tutores disponibles, ver tarifas por hora, agendar sesiones y mantener seguimiento de las tutorías programadas. [cite:1]

## Descripción general

El proyecto está dividido en dos partes principales: un backend que expone una API REST y un frontend que consume esa API desde una aplicación web desarrollada con React. Ambas partes viven en carpetas separadas dentro del mismo repositorio. [cite:1]

## Estructura del proyecto

```bash
FinalHerramientas1/
├── Backend/
├── Frontend/
├── .gitignore
├── README.md
├── Tablas.sql
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

- `Backend/`: API REST construida con Node.js, Express, Sequelize y MySQL. [cite:1]
- `Frontend/`: aplicación SPA construida con React, Vite, React Router y Axios. [cite:1]

## Tecnologías utilizadas

| Capa | Tecnologías |
|---|---|
| Backend | Node.js, Express, Sequelize, MySQL, JWT [cite:1] |
| Frontend | React 19, Vite, React Router, Axios [cite:1] |
| Gestión de paquetes | pnpm [cite:1] |

## Funcionalidades principales

- Registro de usuarios. [cite:1]
- Inicio de sesión con autenticación basada en JWT. [cite:1]
- Consulta del perfil autenticado. [cite:1]
- Visualización de materias disponibles. [cite:1]
- Consulta de tutores por materia. [cite:1]
- Visualización del detalle de cada tutor y su tarifa. [cite:1]
- Creación de sesiones de tutoría. [cite:1]
- Consulta de sesiones registradas por el usuario autenticado. [cite:1]
- Actualización del estado de una sesión. [cite:1]
- Contacto rápido por WhatsApp desde la interfaz. [cite:1]

## Requisitos previos

Antes de ejecutar el proyecto, se necesita lo siguiente: [cite:1]

- Node.js 20 o superior. [cite:1]
- pnpm 11.x. [cite:1]
- MySQL 8 o una versión compatible. [cite:1]

## Instalación

### 1. Crear la base de datos

Ejecuta en MySQL:

```sql
CREATE DATABASE Tutores_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

También puedes utilizar el archivo `Tablas.sql` incluido en el repositorio para crear la estructura inicial de la base de datos. [cite:1]

### 2. Configurar el backend

Desde la carpeta `Backend/`:

```bash
cd Backend
cp .env.example .env
pnpm install
pnpm dev
```

En Windows:

```bash
cd Backend
copy .env.example .env
pnpm install
pnpm dev
```

La API queda disponible en:

```bash
http://localhost:4000
```

[cite:1]

### 3. Configurar el frontend

Desde otra terminal:

```bash
cd Frontend
cp .env.example .env
pnpm install
pnpm dev
```

En Windows:

```bash
cd Frontend
copy .env.example .env
pnpm install
pnpm dev
```

La aplicación queda disponible en:

```bash
http://localhost:5173
```

[cite:1]

## Variables de entorno

### Backend (`Backend/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto del servidor | `4000` [cite:1] |
| `DB_HOST` | Host de MySQL | `localhost` [cite:1] |
| `DB_PORT` | Puerto de MySQL | `3306` [cite:1] |
| `DB_NAME` | Nombre de la base de datos | `Tutores_db` [cite:1] |
| `DB_USER` | Usuario de MySQL | `root` [cite:1] |
| `DB_PASSWORD` | Contraseña de MySQL | `123456` [cite:1] |
| `JWT_SECRET` | Clave secreta para los tokens | `clave_super_segura` [cite:1] |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `1d` [cite:1] |
| `DB_SYNC_ALTER` | Ajuste temporal del esquema | `true` [cite:1] |

### Frontend (`Frontend/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_WHATSAPP_SUPPORT` | Número de soporte por WhatsApp | `573001234567` [cite:1] |

## Scripts útiles

### Backend

Ejecutar desde `Backend/`:

| Comando | Acción |
|---|---|
| `pnpm dev` | Ejecuta la API en desarrollo [cite:1] |
| `pnpm start` | Ejecuta la API en producción [cite:1] |

### Frontend

Ejecutar desde `Frontend/`:

| Comando | Acción |
|---|---|
| `pnpm dev` | Inicia el servidor de desarrollo [cite:1] |
| `pnpm build` | Genera el build de producción [cite:1] |
| `pnpm preview` | Previsualiza el build generado [cite:1] |
| `pnpm lint` | Ejecuta ESLint [cite:1] |

## API REST

La API utiliza el prefijo `/api`. [cite:1]

| Método | Ruta | Requiere auth | Descripción |
|---|---|---|---|
| POST | `/auth/register` | No | Registrar un usuario [cite:1] |
| POST | `/auth/login` | No | Iniciar sesión y obtener token JWT [cite:1] |
| GET | `/auth/me` | Sí | Obtener perfil del usuario autenticado [cite:1] |
| GET | `/subjects` | No | Listar materias [cite:1] |
| GET | `/tutors` | No | Listar tutores, con filtro opcional por materia [cite:1] |
| GET | `/tutors/:id` | No | Obtener detalle de un tutor [cite:1] |
| POST | `/sessions` | Sí | Crear una sesión de tutoría [cite:1] |
| GET | `/sessions/mine` | Sí | Obtener las sesiones del usuario autenticado [cite:1] |
| PATCH | `/sessions/:id/status` | Sí | Actualizar el estado de una sesión [cite:1] |
| GET | `/health` | No | Verificar el estado del sistema [cite:1] |

## Flujo de uso

1. El usuario se registra en la plataforma. [cite:1]
2. Luego inicia sesión y obtiene acceso autenticado. [cite:1]
3. Puede consultar materias y tutores disponibles. [cite:1]
4. Selecciona un tutor según su necesidad y revisa la tarifa por hora. [cite:1]
5. Crea una sesión de tutoría desde la aplicación. [cite:1]
6. Posteriormente puede consultar sus sesiones y hacer seguimiento a su estado. [cite:1]

## Estados de sesión

Las sesiones manejan los siguientes estados: [cite:1]

- `PENDING` [cite:1]
- `CONFIRMED` [cite:1]
- `CANCELLED` [cite:1]
- `COMPLETED` [cite:1]

## Estructura interna

### Backend

```bash
Backend/src/
├── app.js
├── config/
│   └── baseDatos.js
├── modelos/
├── controladores/
├── rutas/
└── middleware/
```

El backend organiza su lógica en modelos, controladores, rutas y middleware de autenticación. [cite:1]

### Frontend

```bash
Frontend/src/
├── paginas/
├── componentes/
├── contextos/
├── utilidades/
└── api/
```

El frontend organiza la aplicación en páginas, componentes reutilizables, contextos globales y un cliente HTTP centralizado. [cite:1]

## Modelo de datos

El repositorio incluye un archivo `Tablas.sql` para la creación de la base de datos. Además, la documentación pública del proyecto indica el uso de tablas como `usuarios`, `materias`, `tutor_materias` y `sesiones`. [cite:1]

| Tabla | Descripción |
|---|---|
| `usuarios` | Información de usuarios registrados [cite:1] |
| `materias` | Asignaturas disponibles [cite:1] |
| `tutor_materias` | Relación entre tutores, materias y tarifa [cite:1] |
| `sesiones` | Registro de tutorías programadas [cite:1] |

## Notas de desarrollo

- El frontend consume la API desde `http://localhost:4000/api`. [cite:1]
- El proyecto usa `pnpm` de manera separada en `Backend/` y `Frontend/`. [cite:1]
- Si se agregan columnas nuevas a la base de datos, puede usarse temporalmente `DB_SYNC_ALTER=true`. [cite:1]
- La aplicación usa nombres de carpetas y archivos en español, aunque algunas rutas del frontend están en inglés por compatibilidad. [cite:1]

## Licencia

Proyecto académico y demostrativo para uso en contexto educativo. [cite:1]