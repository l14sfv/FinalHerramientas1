const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const SALT_ROUNDS = 10;

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;
        const userRole = role || 'STUDENT';

        if (!name || !email || !password) {
        return res
            .status(400)
            .json({ message: 'Nombre, email y contraseña son obligatorios' });
        }

        if (userRole === 'TUTOR' && !phone) {
        return res
            .status(400)
            .json({ message: 'Los tutores deben indicar un teléfono WhatsApp' });
        }

        const existing = await User.findOne({ where: { email } });
        if (existing) {
        return res
            .status(409)
            .json({ message: 'Ya existe un usuario con ese email' });
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await User.create({
        name,
        email,
        passwordHash,
        role: userRole,
        phone: phone || null
        });

        return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error registrando usuario' });
    }
    };

    exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
        return res
            .status(401)
            .json({ message: 'Credenciales inválidas' });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
        return res
            .status(401)
            .json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        return res.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone
        }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error iniciando sesión' });
    }
    };

    exports.me = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'name', 'email', 'role', 'phone', 'createdAt', 'updatedAt']
        });

        if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        return res.json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error obteniendo perfil' });
    }
};