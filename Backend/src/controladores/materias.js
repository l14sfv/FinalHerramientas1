const { Materia } = require('../modelos');

exports.listar = async (req, res) => {
  try {
    const materias = await Materia.findAll();
    return res.json(materias);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error obteniendo materias' });
  }
};

exports.crear = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'El nombre es obligatorio' });
    }

    const materia = await Materia.create({ name });
    return res.status(201).json(materia);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error creando materia' });
  }
};
