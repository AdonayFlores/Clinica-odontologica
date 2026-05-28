const bcrypt = require('bcryptjs');
const pool = require('../database/connection');

// GET /api/odontologos
const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT o.id_odontologo, o.especialidad, o.cedula_profesional, o.created_at,
              u.id_usuario, u.nombre, u.apellido, u.correo, u.rol
       FROM ODONTOLOGO o
       JOIN USUARIO u ON o.id_usuario = u.id_usuario
       ORDER BY u.nombre ASC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener odontólogos:', error);
    res.status(500).json({ error: 'Error al obtener odontólogos.' });
  }
};

// GET /api/odontologos/:id
const getById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT o.id_odontologo, o.especialidad, o.cedula_profesional,
              u.id_usuario, u.nombre, u.apellido, u.correo
       FROM ODONTOLOGO o
       JOIN USUARIO u ON o.id_usuario = u.id_usuario
       WHERE o.id_odontologo = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Odontólogo no encontrado.' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener odontólogo.' });
  }
};

const generateTempPassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let temp = '';
  for (let i = 0; i < 8; i++) {
    temp += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return temp;
};

// POST /api/odontologos — crea usuario + odontólogo en una transacción
const create = async (req, res) => {
  const { nombre, apellido, correo, password, especialidad, cedula_profesional } = req.body;
  if (!nombre || !apellido || !correo) {
    return res.status(400).json({ error: 'Campos requeridos: nombre, apellido, correo.' });
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
    const [userResult] = await conn.query(
      `INSERT INTO USUARIO (nombre, apellido, correo, password_hash, rol, id_estado_usuario, requiere_cambio_password) VALUES (?,?,?,?,?,?,?)`,
      [nombre, apellido, correo, password_hash, 'dentista', 1, requiereCambio]
    );
    const [odResult] = await conn.query(
      `INSERT INTO ODONTOLOGO (id_usuario, especialidad, cedula_profesional) VALUES (?,?,?)`,
      [userResult.insertId, especialidad || null, cedula_profesional || null]
    );
    await conn.commit();
    const [created] = await conn.query(
      `SELECT o.id_odontologo, o.especialidad, o.cedula_profesional,
              u.id_usuario, u.nombre, u.apellido, u.correo, u.requiere_cambio_password
       FROM ODONTOLOGO o JOIN USUARIO u ON o.id_usuario = u.id_usuario
       WHERE o.id_odontologo = ?`,
      [odResult.insertId]
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
    console.error('Error al crear odontólogo:', error);
    res.status(500).json({ error: 'Error al crear odontólogo.' });
  } finally {
    conn.release();
  }
};

// PUT /api/odontologos/:id
const update = async (req, res) => {
  const { especialidad, cedula_profesional, nombre, apellido, correo } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [od] = await conn.query('SELECT id_usuario FROM ODONTOLOGO WHERE id_odontologo = ?', [req.params.id]);
    if (od.length === 0) { await conn.rollback(); return res.status(404).json({ error: 'Odontólogo no encontrado.' }); }

    await conn.query(
      `UPDATE ODONTOLOGO SET especialidad=?, cedula_profesional=? WHERE id_odontologo=?`,
      [especialidad || null, cedula_profesional || null, req.params.id]
    );
    if (nombre || apellido || correo) {
      await conn.query(
        `UPDATE USUARIO SET nombre=COALESCE(?,nombre), apellido=COALESCE(?,apellido), correo=COALESCE(?,correo) WHERE id_usuario=?`,
        [nombre || null, apellido || null, correo || null, od[0].id_usuario]
      );
    }
    await conn.commit();
    const [updated] = await conn.query(
      `SELECT o.id_odontologo, o.especialidad, o.cedula_profesional,
              u.id_usuario, u.nombre, u.apellido, u.correo
       FROM ODONTOLOGO o JOIN USUARIO u ON o.id_usuario = u.id_usuario
       WHERE o.id_odontologo = ?`,
      [req.params.id]
    );
    res.json(updated[0]);
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ error: 'Error al actualizar odontólogo.' });
  } finally {
    conn.release();
  }
};

// DELETE /api/odontologos/:id
const remove = async (req, res) => {
  try {
    const [od] = await pool.query('SELECT id_usuario FROM ODONTOLOGO WHERE id_odontologo = ?', [req.params.id]);
    if (od.length === 0) return res.status(404).json({ error: 'Odontólogo no encontrado.' });
    await pool.query('DELETE FROM ODONTOLOGO WHERE id_odontologo = ?', [req.params.id]);
    res.json({ message: 'Odontólogo eliminado correctamente.' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ error: 'No se puede eliminar: el odontólogo tiene citas o consultas registradas.' });
    }
    res.status(500).json({ error: 'Error al eliminar odontólogo.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
