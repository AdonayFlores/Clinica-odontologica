const pool = require('../database/connection');

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM MEDICAMENTO ORDER BY nombre');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener medicamentos.' });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM MEDICAMENTO WHERE id_medicamento = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Medicamento no encontrado.' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener medicamento.' });
  }
};

const create = async (req, res) => {
  const { nombre, descripcion, presentacion, via_administracion, requiere_receta, estado } = req.body;
  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido.' });
  try {
    const [result] = await pool.query(
      `INSERT INTO MEDICAMENTO (nombre, descripcion, presentacion, via_administracion, requiere_receta, estado) VALUES (?,?,?,?,?,?)`,
      [nombre, descripcion || null, presentacion || null, via_administracion || null, requiere_receta ?? false, estado || 'activo']
    );
    const [created] = await pool.query('SELECT * FROM MEDICAMENTO WHERE id_medicamento = ?', [result.insertId]);
    res.status(201).json(created[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear medicamento.' });
  }
};

const update = async (req, res) => {
  const { nombre, descripcion, presentacion, via_administracion, requiere_receta, estado } = req.body;
  try {
    const [result] = await pool.query(
      `UPDATE MEDICAMENTO SET nombre=?, descripcion=?, presentacion=?, via_administracion=?, requiere_receta=?, estado=? WHERE id_medicamento=?`,
      [nombre, descripcion, presentacion, via_administracion, requiere_receta, estado, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Medicamento no encontrado.' });
    const [updated] = await pool.query('SELECT * FROM MEDICAMENTO WHERE id_medicamento = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar medicamento.' });
  }
};

const remove = async (req, res) => {
  try {
    const [result] = await pool.query('UPDATE MEDICAMENTO SET estado=? WHERE id_medicamento=?', ['inactivo', req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Medicamento no encontrado.' });
    res.json({ message: 'Medicamento desactivado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar medicamento.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
