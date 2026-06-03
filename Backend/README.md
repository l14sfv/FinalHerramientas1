# Backend — Plataforma de Tutorías

API REST con Node.js, Express, Sequelize y MySQL.

Documentación general del proyecto: [../README.md](../README.md).

## Inicio rápido

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Servidor en `http://localhost:4000`. Rutas bajo `/api`.

## Estructura

```
src/
├── app.js              Entrada y sync de BD
├── config/database.js  Conexión Sequelize
├── controllers/        Lógica de endpoints
├── middleware/         JWT auth
├── models/             User, Subject, TutorSubject, Session
└── routes/             Rutas Express
```
