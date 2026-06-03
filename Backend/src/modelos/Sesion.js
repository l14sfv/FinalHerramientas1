const { DataTypes } = require('sequelize');
const sequelize = require('../config/baseDatos');

const Sesion = sequelize.define(
  'Sesion',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'estudiante_id',
    },
    tutorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'tutor_id',
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'materia_id',
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'programado_en',
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'),
      allowNull: false,
      defaultValue: 'PENDING',
      field: 'estado',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'notas',
    },
  },
  {
    tableName: 'sesiones',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en',
  }
);

module.exports = Sesion;
