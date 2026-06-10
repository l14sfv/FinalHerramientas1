# Frontend - Plataforma de Tareas

Aplicación web desarrollada con **React** y **Vite** para la gestión de tareas personales. Permite a los usuarios registrarse, iniciar sesión, crear tareas, actualizar su estado, filtrar por prioridad y ver el listado de tareas activas.

## Tecnologías utilizadas

- React 19
- Vite
- React Router
- Axios
- CSS

## Funcionalidades

- Registro de usuarios.
- Inicio de sesión.
- Consulta del perfil autenticado.
- Visualización de tareas propias.
- Creación de tareas.
- Edición de tareas.
- Cambios de estado de tareas.
- Eliminación de tareas.
- Integración de contacto por WhatsApp.

## Estructura principal

```bash
Frontend/
├── src/
│   ├── api/
│   ├── componentes/
│   ├── contextos/
│   ├── paginas/
│   └── utilidades/
├── public/
├── package.json
└── README.md
```

## Requisitos previos

- Node.js 20 o superior
- pnpm 11.x
- Backend del proyecto en ejecución

## Instalación

Desde la carpeta `Frontend/`:

```bash
pnpm install
```

## Variables de entorno

Crea un archivo `.env` dentro de `Frontend/` con una variable como esta:

```env
VITE_WHATSAPP_SUPPORT=573001234567
```

Esta variable se usa para definir el número de contacto por WhatsApp mostrado en la aplicación.

## Ejecución en desarrollo

```bash
pnpm dev
```

La aplicación se ejecutará normalmente en:

```bash
http://localhost:5173
```

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `pnpm dev` | Inicia el servidor de desarrollo |
| `pnpm build` | Genera la versión de producción |
| `pnpm preview` | Previsualiza el build generado |
| `pnpm lint` | Ejecuta ESLint |

## Conexión con el backend

El frontend consume la API REST del backend desde:

```bash
http://localhost:4000/api
```

Por eso, para que todas las funcionalidades trabajen correctamente, el backend debe estar ejecutándose antes o al mismo tiempo que el frontend.

## Flujo general de uso

1. El usuario accede a la aplicación.
2. Puede registrarse o iniciar sesión.
3. Crea una tarea.
4. Consulta el listado de tareas propias.
5. Actualiza el estado o los detalles de una tarea.
6. Elimina tareas completadas o no deseadas.

## Notas de desarrollo

- La aplicación está organizada por páginas, componentes reutilizables, contextos globales y cliente API.
- Axios se usa para centralizar las peticiones HTTP.
- React Router maneja la navegación entre vistas.
- La interfaz está pensada como SPA.

## Licencia

Proyecto académico con fines educativos.
