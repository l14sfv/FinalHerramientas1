const { Materia, Usuario } = require('../modelos');

exports.listar = async (req, res) => {
  try {
    const materias = await Materia.findAll({
      attributes: ['id', 'name', 'description'],
      order: [['name', 'ASC']],
    });
    return res.json(materias);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error obteniendo materias' });
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const materia = await Materia.findByPk(id, {
      attributes: ['id', 'name', 'description'],
    });
    if (!materia) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }
    return res.json(materia);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error obteniendo materia' });
  }
};

exports.crear = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'El nombre es requerido' });
    }
    const materia = await Materia.create({
      name: name.trim(),
      description: description?.trim() || null,
    });
    return res.status(201).json({
      message: 'Materia creada correctamente',
      materia,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error creando materia' });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const materia = await Materia.findByPk(id);
    if (!materia) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }
    if (name) materia.name = name.trim();
    if (description !== undefined) {
      materia.description = description?.trim() || null;
    }
    await materia.save();
    return res.json({
      message: 'Materia actualizada correctamente',
      materia,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error actualizando materia' });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminada = await Materia.destroy({ where: { id } });
    if (!eliminada) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }
    return res.json({ message: 'Materia eliminada correctamente' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error eliminando materia' });
  }
};

exports.obtenerTutores = async (req, res) => {
  try {
    const { id } = req.params;
    const materia = await Materia.findByPk(id, {
      attributes: ['id', 'name'],
      include: [
        {
          model: Usuario,
          as: 'tutors',
          attributes: ['id', 'name', 'email', 'phone'],
          through: { attributes: ['hourlyRate'] },
        },
      ],
    });
    if (!materia) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }
    return res.json(materia);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error obteniendo tutores' });
  }
};
