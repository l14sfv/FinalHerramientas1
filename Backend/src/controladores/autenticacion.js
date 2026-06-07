const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../modelos');

const RONDAS_SALT = 10;

const limpiarEmail = (email) => String(email || '').trim().toLowerCase();
const limpiarNombre = (name) => String(name || '').trim();
const limpiarTelefono = (phone) =>
  phone ? String(phone).replace(/\D/g, '') : null;

const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

exports.registrar = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const nombreLimpio = limpiarNombre(name);
    const emailLimpio = limpiarEmail(email);
    const telefonoLimpio = limpiarTelefono(phone);

    if (!nombreLimpio || !emailLimpio || !password) {
      return res.status(400).json({
        message: 'Nombre, email y contraseña son obligatorios',
      });
    }

    if (!emailValido(emailLimpio)) {
      return res.status(400).json({
        message: 'El email no tiene un formato válido',
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        message: 'La contraseña debe tener al menos 6 caracteres',
      });
    }

    const existente = await Usuario.findOne({ where: { email: emailLimpio } });
    if (existente) {
      return res.status(409).json({
        message: 'Ya existe un usuario con ese email',
      });
    }

    const passwordHash = await bcrypt.hash(password, RONDAS_SALT);

    const usuario = await Usuario.create({
      name: nombreLimpio,
      email: emailLimpio,
      passwordHash,
      phone: telefonoLimpio,
    });

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      id: usuario.id,
      name: usuario.name,
      email: usuario.email,
      phone: usuario.phone,
    });
  } catch (err) {
    console.error('ERROR REGISTRANDO USUARIO:', err);

    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: err.errors?.[0]?.message || 'Datos inválidos',
      });
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        message: 'Ya existe un usuario con ese email',
      });
    }

    return res.status(500).json({
      message: 'Error registrando usuario',
      detail: err.message,
    });
  }
};

exports.iniciarSesion = async (req, res) => {
  try {
    const emailLimpio = limpiarEmail(req.body.email);
    const { password } = req.body;

    if (!emailLimpio || !password) {
      return res.status(400).json({
        message: 'Email y contraseña son obligatorios',
      });
    }

    const usuario = await Usuario.findOne({ where: { email: emailLimpio } });
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
      },
    });
  } catch (err) {
    console.error('ERROR INICIANDO SESIÓN:', err);
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
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt,
    });
  } catch (err) {
    console.error('ERROR OBTENIENDO PERFIL:', err);
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
      const nombreLimpio = limpiarNombre(name);
      if (!nombreLimpio) {
        return res.status(400).json({ message: 'El nombre no puede estar vacío' });
      }
      usuario.name = nombreLimpio;
    }

    if (email !== undefined) {
      const emailLimpio = limpiarEmail(email);

      if (!emailLimpio) {
        return res.status(400).json({ message: 'El email es obligatorio' });
      }

      if (!emailValido(emailLimpio)) {
        return res.status(400).json({ message: 'El email no tiene un formato válido' });
      }

      if (emailLimpio !== usuario.email) {
        const existente = await Usuario.findOne({ where: { email: emailLimpio } });
        if (existente) {
          return res.status(409).json({ message: 'Ya existe un usuario con ese email' });
        }
        usuario.email = emailLimpio;
      }
    }

    if (phone !== undefined) {
      usuario.phone = limpiarTelefono(phone);
    }

    await usuario.save();

    return res.json({
      message: 'Perfil actualizado correctamente',
      user: {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        phone: usuario.phone,
      },
    });
  } catch (err) {
    console.error('ERROR ACTUALIZANDO PERFIL:', err);

    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: err.errors?.[0]?.message || 'Datos inválidos',
      });
    }

    return res.status(500).json({ message: 'Error actualizando perfil' });
  }
};
