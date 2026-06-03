# Frontend — Plataforma de Tutorías

SPA en React + Vite.

Documentación general: [../README.md](../README.md).

## Inicio rápido

```bash
pnpm install
cp .env.example .env
pnpm dev
```

## Estructura (`src/`)

```
src/
├── paginas/
│   ├── Inicio.jsx
│   ├── IniciarSesion.jsx
│   ├── Registro.jsx
│   ├── Tutores.jsx
│   ├── DetalleTutor.jsx
│   └── Sesiones.jsx
├── componentes/
│   ├── BarraNavegacion.jsx
│   ├── PiePagina.jsx
│   ├── RutaProtegida.jsx
│   └── MensajeWhatsApp.jsx
├── contextos/
│   ├── ContextoAutenticacion.jsx
│   └── ContextoNotificaciones.jsx
├── utilidades/
│   ├── etiquetas.js
│   └── whatsapp.js
└── api/cliente.js
```

## Build

```bash
pnpm build
pnpm preview
```
