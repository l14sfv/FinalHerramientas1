const sequelize = require('../config/database');
const User = require('./User');
const Subject = require('./Subject');
const TutorSubject = require('./TutorSubject');
const Session = require('./Session');

// Relaciones
// User (TUTOR) N:M Subject a través de TutorSubject
User.belongsToMany(Subject, {
    through: TutorSubject,
    as: 'subjects',
    foreignKey: 'tutorId'
});
Subject.belongsToMany(User, {
    through: TutorSubject,
    as: 'tutors',
    foreignKey: 'subjectId'
});

// User (STUDENT) 1:N Session
User.hasMany(Session, {
    foreignKey: 'studentId',
    as: 'studentSessions'
});
Session.belongsTo(User, {
    foreignKey: 'studentId',
    as: 'student'
});

// User (TUTOR) 1:N Session
User.hasMany(Session, {
    foreignKey: 'tutorId',
    as: 'tutorSessions'
});
Session.belongsTo(User, {
    foreignKey: 'tutorId',
    as: 'tutor'
});

// Subject 1:N Session
Subject.hasMany(Session, {
    foreignKey: 'subjectId',
    as: 'subjectSessions'
});
Session.belongsTo(Subject, {
    foreignKey: 'subjectId',
    as: 'subject'
});

const db = {
    sequelize,
    User,
    Subject,
    TutorSubject,
    Session
};

module.exports = db;