const { Session, User, Subject } = require('../models');

exports.createSession = async (req, res) => {
    try {
        const { tutorId, subjectId, scheduledAt, notes } = req.body;
        const studentId = req.user.id;

        if (!tutorId || !subjectId || !scheduledAt) {
        return res
            .status(400)
            .json({ message: 'tutorId, subjectId y scheduledAt son obligatorios' });
        }

        const session = await Session.create({
        studentId,
        tutorId,
        subjectId,
        scheduledAt,
        notes
        });

        return res.status(201).json(session);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error creando sesión' });
    }
    };

    exports.getMySessions = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        let where = {};
        if (role === 'STUDENT') {
        where.studentId = userId;
        } else if (role === 'TUTOR') {
        where.tutorId = userId;
        } else if (role === 'ADMIN') {
        // ve todas
        }

        const sessions = await Session.findAll({
        where,
        include: [
            { model: User, as: 'student', attributes: ['id', 'name', 'email', 'phone'] },
            { model: User, as: 'tutor', attributes: ['id', 'name', 'email', 'phone'] },
            { model: Subject, as: 'subject', attributes: ['id', 'name'] }
        ],
        order: [['scheduledAt', 'DESC']]
        });

        return res.json(sessions);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error obteniendo sesiones' });
    }
    };

    exports.updateSessionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowed = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
        if (!allowed.includes(status)) {
        return res
            .status(400)
            .json({ message: 'Estado inválido' });
        }

        const session = await Session.findByPk(id);
        if (!session) {
        return res.status(404).json({ message: 'Sesión no encontrada' });
        }

        // Reglas simples: el tutor o admin puede cambiar estado
        if (
        req.user.role !== 'ADMIN' &&
        req.user.id !== session.tutorId
        ) {
        return res
            .status(403)
            .json({ message: 'No puedes actualizar esta sesión' });
        }

        session.status = status;
        await session.save();

        return res.json(session);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error actualizando sesión' });
    }
};