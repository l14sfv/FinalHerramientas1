const { DataTypes } = require('sequelize');
const sequelize = require('../config/baseDatos');

const Materia = sequelize.define(
  'Materia',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'nombre',
    },
  },
  {
    tableName: 'materias',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en',
  }
);

module.exports = Materia;
