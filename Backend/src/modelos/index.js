const sequelize = require('../config/baseDatos');
const Usuario = require('./Usuario');
const Materia = require('./Materia');
const TutorMateria = require('./TutorMateria');
const Sesion = require('./Sesion');

Usuario.belongsToMany(Materia, {
  through: TutorMateria,
  as: 'subjects',
  foreignKey: 'tutorId',
});
Materia.belongsToMany(Usuario, {
  through: TutorMateria,
  as: 'tutors',
  foreignKey: 'subjectId',
});

Usuario.hasMany(Sesion, { foreignKey: 'studentId', as: 'studentSessions' });
Sesion.belongsTo(Usuario, { foreignKey: 'studentId', as: 'student' });

Usuario.hasMany(Sesion, { foreignKey: 'tutorId', as: 'tutorSessions' });
Sesion.belongsTo(Usuario, { foreignKey: 'tutorId', as: 'tutor' });

Materia.hasMany(Sesion, { foreignKey: 'subjectId', as: 'subjectSessions' });
Sesion.belongsTo(Materia, { foreignKey: 'subjectId', as: 'subject' });

module.exports = {
  sequelize,
  Usuario,
  Materia,
  TutorMateria,
  Sesion,
};
