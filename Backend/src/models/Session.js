const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Session = sequelize.define(
    'Session',
    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
        studentId: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
        tutorId: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
        subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
        scheduledAt: {
        type: DataTypes.DATE,
        allowNull: false
        },
        status: {
        type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'),
        defaultValue: 'PENDING'
        },
        notes: {
        type: DataTypes.TEXT,
        allowNull: true
        }
    },
    {
        tableName: 'sessions',
        timestamps: true
    }
);

module.exports = Session;