const bcrypt = require('bcryptjs');
const pool = require('../database/connection');

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id_usuario, u.nombre, u.apellido, u.correo, u.rol, u.fecha_creacion,
              eu.nombre AS estado_nombre, eu.codigo AS estado_codigo
       FROM USUARIO u
       JOIN ESTADO_USUARIO eu ON u.id_estado_usuario = eu.id_estado_usuario
       ORDER BY u.fecha_creacion DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios.' });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id_usuario, u.nombre, u.apellido, u.correo, u.rol, u.fecha_creacion,
              eu.nombre AS estado_nombre, eu.codigo AS estado_codigo
       FROM USUARIO u
       JOIN ESTADO_USUARIO eu ON u.id_estado_usuario = eu.id_estado_usuario
       WHERE u.id_usuario = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado.' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario.' });
  }
};

const generateTempPassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'; // Evitamos I, l, O, 0 por confusión visual
  let temp = '';
  for (let i = 0; i < 8; i++) {
    temp += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return temp;
};

const create = async (req, res) => {
  const { nombre, apellido, correo, password, rol, id_estado_usuario } = req.body;
  if (!nombre || !apellido || !correo || !rol) {
    return res.status(400).json({ error: 'Campos requeridos: nombre, apellido, correo, rol.' });
  }

  let finalPassword = password;
  let requiereCambio = 0;
  if (!finalPassword || finalPassword.trim() === '') {
    finalPassword = generateTempPassword();
    requiereCambio = 1;
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const password_hash = await bcrypt.hash(finalPassword, 10);
    const [result] = await conn.query(
      `INSERT INTO USUARIO (nombre, apellido, correo, password_hash, rol, id_estado_usuario, requiere_cambio_password) VALUES (?,?,?,?,?,?,?)`,
      [nombre, apellido, correo, password_hash, rol, id_estado_usuario || 1, requiereCambio]
    );
    const id_usuario = result.insertId;

    // Aprovisionamiento automático de perfiles físicos según rol
    if (rol === 'dentista') {
      await conn.query(
        `INSERT INTO ODONTOLOGO (id_usuario, especialidad, cedula_profesional) VALUES (?, ?, ?)`,
        [id_usuario, 'General', 'Pendiente']
      );
    } else if (rol === 'paciente') {
      const [pacienteRes] = await conn.query(
        `INSERT INTO PACIENTE (id_usuario, nombres, apellidos, correo, fecha_nacimiento, sexo) VALUES (?, ?, ?, ?, ?, ?)`,
        [id_usuario, nombre, apellido, correo, '2000-01-01', 'No espec.']
      );
      // Crear historial clínico automáticamente para el paciente
      await conn.query(
        `INSERT INTO HISTORIAL_CLINICO (id_paciente) VALUES (?)`,
        [pacienteRes.insertId]
      );
    }

    await conn.commit();

    const [created] = await conn.query(
      'SELECT id_usuario, nombre, apellido, correo, rol, requiere_cambio_password, fecha_creacion FROM USUARIO WHERE id_usuario = ?',
      [id_usuario]
    );
    res.status(201).json({
      ...created[0],
      passwordTemp: requiereCambio ? finalPassword : null
    });
  } catch (error) {
    await conn.rollback();
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El correo ya está registrado.' });
    }
    console.error('Error al crear usuario y aprovisionar perfil:', error);
    res.status(500).json({ error: 'Error al crear usuario.' });
  } finally {
    conn.release();
  }
};

const update = async (req, res) => {
  const { nombre, apellido, correo, id_estado_usuario } = req.body;
  try {
    const [current] = await pool.query('SELECT rol FROM USUARIO WHERE id_usuario = ?', [req.params.id]);
    if (current.length === 0) return res.status(404).json({ error: 'Usuario no encontrado.' });

    // Forzar estado activo (1) si el usuario es administrador para evitar lockouts
    const finalEstado = current[0].rol === 'admin' ? 1 : id_estado_usuario;

    const [result] = await pool.query(
      `UPDATE USUARIO SET nombre=?, apellido=?, correo=?, id_estado_usuario=? WHERE id_usuario=?`,
      [nombre, apellido, correo, finalEstado, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado.' });
    const [updated] = await pool.query(
      'SELECT id_usuario, nombre, apellido, correo, rol, fecha_creacion FROM USUARIO WHERE id_usuario = ?',
      [req.params.id]
    );
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario.' });
  }
};

const changePassword = async (req, res) => {
  const { password_actual, password_nueva } = req.body;
  const id_usuario = req.params.id;

  try {
    const [rows] = await pool.query('SELECT password_hash FROM USUARIO WHERE id_usuario = ?', [id_usuario]);
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado.' });

    // Si el usuario que hace la petición NO es un admin modificando a otra persona, validamos la contraseña actual
    if (!(req.user.rol === 'admin' && req.user.id_usuario.toString() !== id_usuario.toString())) {
      if (!password_actual) return res.status(400).json({ error: 'Contraseña actual requerida.' });
      const valida = await bcrypt.compare(password_actual, rows[0].password_hash);
      if (!valida) return res.status(401).json({ error: 'Contraseña actual incorrecta.' });
    }

    const nueva_hash = await bcrypt.hash(password_nueva, 10);
    await pool.query('UPDATE USUARIO SET password_hash=? WHERE id_usuario=?', [nueva_hash, id_usuario]);
    res.json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al cambiar contraseña.' });
  }
};

module.exports = { getAll, getById, create, update, changePassword };
