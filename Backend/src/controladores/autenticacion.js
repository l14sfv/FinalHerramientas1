const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../modelos');

const RONDAS_SALT = 10;

exports.registrar = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son obligatorios' });
    }

    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      return res.status(409).json({ message: 'Ya existe un usuario con ese email' });
    }

    const passwordHash = await bcrypt.hash(password, RONDAS_SALT);

    const usuario = await Usuario.create({
      name: name.trim(),
      email: email.trim(),
      passwordHash,
      phone: phone ? String(phone).replace(/\D/g, '') : null,
    });

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      id: usuario.id,
      name: usuario.name,
      email: usuario.email,
      phone: usuario.phone,
      role: usuario.role,
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
      { id: usuario.id, email: usuario.email },
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
        phone: usuario.phone,
        role: usuario.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error iniciando sesión' });
  }
};

exports.perfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.json({
      id: usuario.id,
      name: usuario.name,
      email: usuario.email,
      phone: usuario.phone,
      role: usuario.role,
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error obteniendo perfil' });
  }
};

exports.actualizarPerfil = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (name !== undefined) {
      if (!String(name).trim()) {
        return res.status(400).json({ message: 'El nombre no puede estar vacío' });
      }
      usuario.name = name.trim();
    }

    if (email !== undefined) {
      if (!email) {
        return res.status(400).json({ message: 'El email es obligatorio' });
      }
      if (email !== usuario.email) {
        const existente = await Usuario.findOne({ where: { email } });
        if (existente) {
          return res.status(409).json({ message: 'Ya existe un usuario con ese email' });
        }
        usuario.email = email.trim();
      }
    }

    if (phone !== undefined) {
      usuario.phone = phone ? String(phone).replace(/\D/g, '') : null;
    }

    await usuario.save();

    const actualizado = {
      id: usuario.id,
      name: usuario.name,
      email: usuario.email,
      phone: usuario.phone,
      role: usuario.role,
    };

    return res.json({
      message: 'Perfil actualizado correctamente',
      user: actualizado,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error actualizando perfil' });
  }
};

