# Frontend - Plataforma de Tutorías

Aplicación web desarrollada con **React** y **Vite** para la gestión de una plataforma de tutorías académicas. Permite a los usuarios registrarse, iniciar sesión, consultar materias, visualizar tutores disponibles, agendar sesiones y hacer seguimiento a sus tutorías. 

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
- Visualización de materias.
- Consulta de tutores por materia.
- Visualización del detalle de un tutor.
- Creación de sesiones.
- Consulta de sesiones registradas.
- Actualización visual del estado de sesiones.
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
3. Consulta las materias disponibles.
4. Visualiza los tutores relacionados con una materia.
5. Revisa el detalle del tutor y su tarifa.
6. Agenda una sesión.
7. Consulta el historial o listado de sesiones creadas.

## Notas de desarrollo

- La aplicación está organizada por páginas, componentes reutilizables, contextos globales y cliente API.
- Axios se usa para centralizar las peticiones HTTP.
- React Router maneja la navegación entre vistas.
- La interfaz está pensada como SPA.

## Licencia

Proyecto académico con fines educativos.
