const db = require('../modelos');
const { Op } = require('sequelize');

const Tarea = db.Tarea;
const Usuario = db.Usuario;

const crear = async (req, res) => {
  try {
    const { titulo, descripcion, prioridad, fechaVencimiento } = req.body;
    const usuarioId = req.user.id;

    if (!titulo || titulo.trim() === '') {
      return res.status(400).json({ error: 'El título es requerido' });
    }

    const tarea = await Tarea.create({
      usuarioId,
      titulo: titulo.trim(),
      descripcion: descripcion?.trim() || null,
      prioridad: prioridad || 'MEDIA',
      fechaVencimiento: fechaVencimiento || null,
      estado: 'PENDIENTE',
    });

    res.status(201).json(tarea);
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ error: 'Error al crear tarea' });
  }
};

const obtenerMias = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { estado, prioridad, search } = req.query;

    const where = { usuarioId };

    if (estado) {
      where.estado = estado;
    }
    if (prioridad) {
      where.prioridad = prioridad;
    }
    if (search) {
      where[Op.or] = [
        { titulo: { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}%` } },
      ];
    }

    const tareas = await Tarea.findAll({
      where,
      order: [['creado_en', 'DESC']],
    });

    res.json(tareas);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
};

const obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;

    const tarea = await Tarea.findByPk(id);

    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    if (tarea.usuarioId !== usuarioId) {
      return res.status(403).json({ error: 'No tienes permisos para esta tarea' });
    }

    res.json(tarea);
  } catch (error) {
    console.error('Error al obtener tarea:', error);
    res.status(500).json({ error: 'Error al obtener tarea' });
  }
};

const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;
    const { titulo, descripcion, prioridad, fechaVencimiento, estado } = req.body;

    const tarea = await Tarea.findByPk(id);

    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    if (tarea.usuarioId !== usuarioId) {
      return res.status(403).json({ error: 'No tienes permisos para esta tarea' });
    }

    if (titulo !== undefined) tarea.titulo = titulo.trim();
    if (descripcion !== undefined) tarea.descripcion = descripcion?.trim() || null;
    if (prioridad !== undefined) tarea.prioridad = prioridad;
    if (fechaVencimiento !== undefined) tarea.fechaVencimiento = fechaVencimiento;
    if (estado !== undefined) tarea.estado = estado;

    await tarea.save();
    res.json(tarea);
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({ error: 'Error al actualizar tarea' });
  }
};

const cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const usuarioId = req.user.id;

    if (!['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const tarea = await Tarea.findByPk(id);

    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    if (tarea.usuarioId !== usuarioId) {
      return res.status(403).json({ error: 'No tienes permisos para esta tarea' });
    }

    tarea.estado = estado;
    await tarea.save();
    res.json(tarea);
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ error: 'Error al cambiar estado' });
  }
};

const eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;

    const tarea = await Tarea.findByPk(id);

    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    if (tarea.usuarioId !== usuarioId) {
      return res.status(403).json({ error: 'No tienes permisos para esta tarea' });
    }

    await tarea.destroy();
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ error: 'Error al eliminar tarea' });
  }
};

module.exports = {
  crear,
  obtenerMias,
  obtenerPorId,
  actualizar,
  cambiarEstado,
  eliminar,
};
