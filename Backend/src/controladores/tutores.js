const { Usuario, Materia } = require('../modelos');

exports.listar = async (req, res) => {
  try {
    const { subjectId } = req.query;
    const where = { role: 'TUTOR' };

    const include = [
      {
        model: Materia,
        as: 'subjects',
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
