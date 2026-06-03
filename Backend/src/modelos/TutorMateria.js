const { DataTypes } = require('sequelize');
const sequelize = require('../config/baseDatos');

const TutorMateria = sequelize.define(
  'TutorSubject',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    hourlyRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'precio_hora',
    },
  },
  {
    tableName: 'tutor_materias',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en',
  }
);

module.exports = TutorMateria;
