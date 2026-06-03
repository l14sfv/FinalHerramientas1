const { Usuario, Materia, TutorMateria } = require('../modelos');

exports.listar = async (req, res) => {
  try {
    const { subjectId } = req.query;
    const where = { role: 'TUTOR' };

    const include = [
      {
        model: Materia,
        as: 'subjects',
        attributes: ['id', 'name', 'description'],
        through: { attributes: ['hourlyRate'] },
      },
    ];

    if (subjectId) {
      include[0].where = { id: subjectId };
    }

    const tutores = await Usuario.findAll({
      where,
      attributes: ['id', 'name', 'email', 'phone', 'role'],
      include,
    });

    return res.json(tutores);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error obteniendo tutores' });
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const tutor = await Usuario.findOne({
      where: { id, role: 'TUTOR' },
      attributes: ['id', 'name', 'email', 'phone', 'role'],
      include: [
        {
          model: Materia,
          as: 'subjects',
          attributes: ['id', 'name', 'description'],
          through: { attributes: ['hourlyRate'] },
        },
      ],
    });

    if (!tutor) {
      return res.status(404).json({ message: 'Tutor no encontrado' });
    }

    return res.json(tutor);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error obteniendo tutor' });
  }
};

exports.asignarMateria = async (req, res) => {
  try {
    const tutorId = Number(req.params.id);
    const { subjectId, hourlyRate } = req.body;

    if (req.user.role === 'TUTOR' && req.user.id !== tutorId) {
      return res.status(403).json({ message: 'No tienes permisos para asignar materias a este tutor' });
    }

    if (!subjectId || hourlyRate === undefined) {
      return res.status(400).json({ message: 'subjectId y hourlyRate son obligatorios' });
    }

    const tutor = await Usuario.findOne({ where: { id: tutorId, role: 'TUTOR' } });
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor no encontrado' });
    }

    const materia = await Materia.findByPk(subjectId);
    if (!materia) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }

    const [registro] = await TutorMateria.findOrCreate({
      where: { tutorId, subjectId },
      defaults: {
        hourlyRate,
      },
    });

    if (!registro.isNewRecord) {
      registro.hourlyRate = hourlyRate;
      await registro.save();
    }

    return res.status(200).json({ message: 'Materia asignada correctamente', tutorId, subjectId, hourlyRate });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error asignando materia al tutor' });
  }
};

exports.removerMateria = async (req, res) => {
  try {
    const tutorId = Number(req.params.id);
    const subjectId = Number(req.params.subjectId);

    if (req.user.role === 'TUTOR' && req.user.id !== tutorId) {
      return res.status(403).json({ message: 'No tienes permisos para quitar materias a este tutor' });
    }

    const tutor = await Usuario.findOne({ where: { id: tutorId, role: 'TUTOR' } });
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor no encontrado' });
    }

    const eliminada = await TutorMateria.destroy({ where: { tutorId, subjectId } });
    if (!eliminada) {
      return res.status(404).json({ message: 'Asignación no encontrada' });
    }

    return res.json({ message: 'Materia removida correctamente' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error removiendo materia del tutor' });
  }
};
