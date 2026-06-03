const { User, Subject } = require('../models');

exports.getTutors = async (req, res) => {
    try {
        const { subjectId } = req.query;

        const where = { role: 'TUTOR' };

        const include = [
        {
            model: Subject,
            as: 'subjects',
            through: { attributes: ['hourlyRate'] }
        }
        ];

        if (subjectId) {
        // Filtrar por materia específica
        include[0].where = { id: subjectId };
        }

        const tutors = await User.findAll({
        where,
        attributes: ['id', 'name', 'email', 'phone', 'role'],
        include
        });

        return res.json(tutors);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error obteniendo tutores' });
    }
    };

    exports.getTutorById = async (req, res) => {
    try {
        const { id } = req.params;

        const tutor = await User.findOne({
        where: { id, role: 'TUTOR' },
        attributes: ['id', 'name', 'email', 'phone', 'role'],
        include: [
            {
            model: Subject,
            as: 'subjects',
            through: { attributes: ['hourlyRate'] }
            }
        ]
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