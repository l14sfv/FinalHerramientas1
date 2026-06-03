const { Subject } = require('../models');

exports.getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.findAll();
        return res.json(subjects);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error obteniendo materias' });
    }
    };

    exports.createSubject = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
        return res
            .status(400)
            .json({ message: 'El nombre es obligatorio' });
        }

        const subject = await Subject.create({ name, description });
        return res.status(201).json(subject);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error creando materia' });
    }
};