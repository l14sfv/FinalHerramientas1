const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TutorSubject = sequelize.define(
    'TutorSubject',
    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
        tutorId: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
        subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
        hourlyRate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
        }
    },
    {
        tableName: 'tutor_subjects',
        timestamps: true
    }
);

module.exports = TutorSubject;