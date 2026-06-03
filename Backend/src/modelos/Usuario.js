const { DataTypes } = require('sequelize');
const sequelize = require('../config/baseDatos');

const Usuario = sequelize.define(
  'Usuario',
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
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'contrasena',
    },
    role: {
      type: DataTypes.ENUM('STUDENT', 'TUTOR', 'ADMIN'),
      allowNull: false,
      defaultValue: 'STUDENT',
      field: 'rol',
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'telefono',
    },
  },
  {
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en',
  }
);

module.exports = Usuario;
