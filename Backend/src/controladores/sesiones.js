const { Sesion, Usuario, Materia } = require('../modelos');

exports.crear = async (req, res) => {
  try {
    const { tutorId, subjectId, scheduledAt, notes } = req.body;
    const studentId = req.user.id;

    if (!tutorId || !subjectId || !scheduledAt) {
      return res.status(400).json({
        message: 'tutorId, subjectId y scheduledAt son obligatorios',
      });
    }

    const sesion = await Sesion.create({
      studentId,
      tutorId,
      subjectId,
      scheduledAt,
      notes,
    });

    return res.status(201).json(sesion);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error creando sesión' });
  }
};

exports.misSesiones = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let where = {};
    if (role === 'STUDENT') {
      where.studentId = userId;
    } else if (role === 'TUTOR') {
      where.tutorId = userId;
    }

    const sesiones = await Sesion.findAll({
      where,
      include: [
        { model: Usuario, as: 'student', attributes: ['id', 'name', 'email', 'phone'] },
        { model: Usuario, as: 'tutor', attributes: ['id', 'name', 'email', 'phone'] },
        { model: Materia, as: 'subject', attributes: ['id', 'name'] },
      ],
      order: [['scheduledAt', 'DESC']],
    });

    return res.json(sesiones);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error obteniendo sesiones' });
  }
};

exports.actualizarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const permitidos = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
    if (!permitidos.includes(status)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const sesion = await Sesion.findByPk(id);
    if (!sesion) {
      return res.status(404).json({ message: 'Sesión no encontrada' });
    }

    if (req.user.role !== 'ADMIN' && req.user.id !== sesion.tutorId) {
      return res.status(403).json({ message: 'No puedes actualizar esta sesión' });
    }

    sesion.status = status;
    await sesion.save();

    return res.json(sesion);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error actualizando sesión' });
  }
};
