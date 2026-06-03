require('dotenv').config();
const express = require('express');
const cors = require('cors');

const db = require('./models');
const apiRoutes = require('./routes');

const app = express();

const PORT = process.env.PORT || 4000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
    res.json({ message: 'API Tutoring Platform OK' });
});

app.use('/api', apiRoutes);

// Sincronizar modelos con la BD y levantar servidor
db.sequelize
  .sync({ alter: process.env.DB_SYNC_ALTER === 'true' })
    .then(() => {
        console.log('Base de datos sincronizada');
        app.listen(PORT, () => {
        console.log(`Servidor escuchando en puerto ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error al sincronizar la base de datos:', err);
    });