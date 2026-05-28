const pool = require('../database/connection');

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT l.*, i.nombre AS insumo_nombre, p.nombre_proveedor
       FROM LOTE_INSUMO l
       JOIN INSUMO_CLINICO i ON l.id_insumo = i.id_insumo
       JOIN PROVEEDOR p ON l.id_proveedor = p.id_proveedor
       ORDER BY l.fecha_ingreso DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener lotes.' });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT l.*, i.nombre AS insumo_nombre, p.nombre_proveedor
       FROM LOTE_INSUMO l
       JOIN INSUMO_CLINICO i ON l.id_insumo = i.id_insumo
       JOIN PROVEEDOR p ON l.id_proveedor = p.id_proveedor
       WHERE l.id_lote = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Lote no encontrado.' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener lote.' });
  }
};

const create = async (req, res) => {
  const { id_insumo, id_proveedor, numero_lote, fecha_ingreso, fecha_vencimiento, cantidad_inicial, observaciones } = req.body;
  if (!id_insumo || !id_proveedor || !numero_lote || !fecha_ingreso || !fecha_vencimiento || !cantidad_inicial) {
    return res.status(400).json({ error: 'Campos requeridos: id_insumo, id_proveedor, numero_lote, fechas, cantidad_inicial.' });
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO LOTE_INSUMO (id_insumo, id_proveedor, numero_lote, fecha_ingreso, fecha_vencimiento, cantidad_inicial, cantidad_disponible, observaciones)
       VALUES (?,?,?,?,?,?,?,?)`,
      [id_insumo, id_proveedor, numero_lote, fecha_ingreso, fecha_vencimiento, cantidad_inicial, cantidad_inicial, observaciones || null]
    );
    const [created] = await pool.query('SELECT * FROM LOTE_INSUMO WHERE id_lote = ?', [result.insertId]);
    res.status(201).json(created[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear lote.' });
  }
};

const update = async (req, res) => {
  const { cantidad_disponible, observaciones } = req.body;
  try {
    const [result] = await pool.query(
      `UPDATE LOTE_INSUMO SET cantidad_disponible=?, observaciones=? WHERE id_lote=?`,
      [cantidad_disponible, observaciones, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Lote no encontrado.' });
    const [updated] = await pool.query('SELECT * FROM LOTE_INSUMO WHERE id_lote = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar lote.' });
  }
};

module.exports = { getAll, getById, create, update };
