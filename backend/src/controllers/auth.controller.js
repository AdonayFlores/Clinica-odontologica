const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../database/connection');

const login = async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ error: 'Correo y contraseña son requeridos.' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT u.*, eu.nombre AS estado_nombre, eu.codigo AS estado_codigo 
       FROM USUARIO u 
       JOIN ESTADO_USUARIO eu ON u.id_estado_usuario = eu.id_estado_usuario
       WHERE u.correo = ?`,
      [correo]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const usuario = rows[0];

    if (usuario.estado_codigo !== 'ACTIVO') {
      return res.status(403).json({ error: 'Usuario inactivo o suspendido.' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        correo: usuario.correo,
        rol: usuario.rol,
        nombre: usuario.nombre,
        apellido: usuario.apellido
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        rol: usuario.rol,
        requiere_cambio_password: !!usuario.requiere_cambio_password
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

const logout = (req, res) => {
  res.json({ message: 'Sesión cerrada correctamente.' });
};

// POST /api/auth/register — auto-registro de pacientes (público, sin token)
const register = async (req, res) => {
  const { nombre, apellido, correo, password, telefono, fecha_nacimiento, sexo, direccion, documento_identidad, tipo_sangre, alergias } = req.body;

  if (!nombre || !apellido || !correo || !password) {
    return res.status(400).json({ error: 'Nombre, apellido, correo y contraseña son requeridos.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const password_hash = await bcrypt.hash(password, 10);

    // Crear usuario con rol forzado a "paciente" — nunca puede registrarse como admin/dentista
    const [userResult] = await conn.query(
      `INSERT INTO USUARIO (nombre, apellido, correo, password_hash, rol, id_estado_usuario) VALUES (?,?,?,?,?,?)`,
      [nombre, apellido, correo, password_hash, 'paciente', 1]
    );

    // Si tiene datos clínicos, crear también el registro de paciente
    if (fecha_nacimiento && sexo) {
      await conn.query(
        `INSERT INTO PACIENTE (id_usuario, nombres, apellidos, documento_identidad, fecha_nacimiento, sexo, alergias, tipo_sangre, telefono, correo, direccion)
         VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
        [userResult.insertId, nombre, apellido, documento_identidad || null, fecha_nacimiento, sexo,
         alergias || null, tipo_sangre || null, telefono || null, correo, direccion || null]
      );
    }

    await conn.commit();

    // Generar token para que el usuario ya quede logueado
    const token = jwt.sign(
      { id_usuario: userResult.insertId, correo, rol: 'paciente', nombre, apellido },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(201).json({
      message: 'Cuenta creada correctamente.',
      token,
      usuario: { id_usuario: userResult.insertId, nombre, apellido, correo, rol: 'paciente' }
    });
  } catch (error) {
    await conn.rollback();
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El correo ya está registrado.' });
    }
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al crear la cuenta.' });
  } finally {
    conn.release();
  }
};

const recuperarPassword = async (req, res) => {
  const { correo } = req.body;
  if (!correo) {
    return res.status(400).json({ error: 'El correo electrónico es requerido.' });
  }

  try {
    const [rows] = await pool.query('SELECT id_usuario FROM USUARIO WHERE correo = ?', [correo]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No existe ningún usuario registrado con este correo.' });
    }

    const id_usuario = rows[0].id_usuario;
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let tempPassword = '';
    for (let i = 0; i < 8; i++) {
      tempPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const password_hash = await bcrypt.hash(tempPassword, 10);
    await pool.query(
      'UPDATE USUARIO SET password_hash = ?, requiere_cambio_password = 1 WHERE id_usuario = ?',
      [password_hash, id_usuario]
    );

    res.json({
      message: 'Se ha generado una contraseña temporal de recuperación.',
      passwordTemp: tempPassword
    });
  } catch (error) {
    console.error('Error al recuperar contraseña:', error);
    res.status(500).json({ error: 'Error al recuperar contraseña.' });
  }
};

const cambiarPasswordTemporal = async (req, res) => {
  const { correo, password_actual, password_nueva } = req.body;
  if (!correo || !password_actual || !password_nueva) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }
  if (password_nueva.length < 6) {
    return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres.' });
  }

  try {
    const [rows] = await pool.query('SELECT id_usuario, password_hash FROM USUARIO WHERE correo = ?', [correo]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const usuario = rows[0];
    const valida = await bcrypt.compare(password_actual, usuario.password_hash);
    if (!valida) {
      return res.status(401).json({ error: 'La contraseña temporal ingresada es incorrecta.' });
    }

    const nueva_hash = await bcrypt.hash(password_nueva, 10);
    await pool.query(
      'UPDATE USUARIO SET password_hash = ?, requiere_cambio_password = 0 WHERE id_usuario = ?',
      [nueva_hash, usuario.id_usuario]
    );

    res.json({ message: 'Contraseña actualizada correctamente. Ya puedes acceder al sistema.' });
  } catch (error) {
    console.error('Error al cambiar contraseña temporal:', error);
    res.status(500).json({ error: 'Error al actualizar la contraseña.' });
  }
};

module.exports = { login, logout, register, recuperarPassword, cambiarPasswordTemporal };
