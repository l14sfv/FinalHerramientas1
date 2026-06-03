const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../modelos');

const RONDAS_SALT = 10;

exports.registrar = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const rol = role || 'STUDENT';

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son obligatorios' });
    }

    if (rol === 'TUTOR' && !phone) {
      return res.status(400).json({ message: 'Los tutores deben indicar un teléfono WhatsApp' });
    }

    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      return res.status(409).json({ message: 'Ya existe un usuario con ese email' });
    }

    const passwordHash = await bcrypt.hash(password, RONDAS_SALT);

    const usuario = await Usuario.create({
      name,
      email,
      passwordHash,
      role: rol,
      phone: phone || null,
    });

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      id: usuario.id,
      name: usuario.name,
      email: usuario.email,
      role: usuario.role,
      phone: usuario.phone,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error registrando usuario' });
  }
};

exports.iniciarSesion = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const valido = await bcrypt.compare(password, usuario.passwordHash);
    if (!valido) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        role: usuario.role,
        phone: usuario.phone,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error iniciando sesión' });
  }
};

exports.perfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'phone', 'createdAt', 'updatedAt'],
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.json(usuario);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error obteniendo perfil' });
  }
};
