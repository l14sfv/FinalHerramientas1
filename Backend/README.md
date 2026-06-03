# Backend — Plataforma de Tutorías

API REST con Node.js, Express, Sequelize y MySQL.

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
├── app.js
├── config/baseDatos.js
├── modelos/
│   ├── Usuario.js
│   ├── Materia.js
│   ├── TutorMateria.js
│   ├── Sesion.js
│   └── index.js
├── controladores/
│   ├── autenticacion.js
│   ├── materias.js
│   ├── tutores.js
│   ├── sesiones.js
│   └── salud.js
├── rutas/
│   ├── autenticacion.js
│   ├── materias.js
│   ├── tutores.js
│   ├── sesiones.js
│   └── index.js
└── middleware/
    ├── autenticacion.js
    └── roles.js
```

## Base de datos

Esquema en español en MySQL (`Tutores_db`): `usuarios`, `materias`, `tutor_materias`, `sesiones`.

Migrar datos de tablas en inglés:

```bash
pnpm migrate:spanish
```
