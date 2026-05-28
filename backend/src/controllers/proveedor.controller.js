const pool = require('../database/connection');

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM PROVEEDOR ORDER BY nombre_proveedor');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener proveedores.' });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM PROVEEDOR WHERE id_proveedor = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Proveedor no encontrado.' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener proveedor.' });
  }
};

const create = async (req, res) => {
  const { nombre_proveedor, telefono, correo, direccion, contacto } = req.body;
  if (!nombre_proveedor) return res.status(400).json({ error: 'El nombre del proveedor es requerido.' });
  try {
    const [result] = await pool.query(
      `INSERT INTO PROVEEDOR (nombre_proveedor, telefono, correo, direccion, contacto) VALUES (?,?,?,?,?)`,
      [nombre_proveedor, telefono || null, correo || null, direccion || null, contacto || null]
    );
    const [created] = await pool.query('SELECT * FROM PROVEEDOR WHERE id_proveedor = ?', [result.insertId]);
    res.status(201).json(created[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear proveedor.' });
  }
};

const update = async (req, res) => {
  const { nombre_proveedor, telefono, correo, direccion, contacto } = req.body;
  try {
    const [result] = await pool.query(
      `UPDATE PROVEEDOR SET nombre_proveedor=?, telefono=?, correo=?, direccion=?, contacto=? WHERE id_proveedor=?`,
      [nombre_proveedor, telefono, correo, direccion, contacto, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Proveedor no encontrado.' });
    const [updated] = await pool.query('SELECT * FROM PROVEEDOR WHERE id_proveedor = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar proveedor.' });
  }
};

const remove = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM PROVEEDOR WHERE id_proveedor = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Proveedor no encontrado.' });
    res.json({ message: 'Proveedor eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar proveedor.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
