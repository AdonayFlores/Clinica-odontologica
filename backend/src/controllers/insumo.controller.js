const pool = require('../database/connection');

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT i.*, ei.nombre AS estado_nombre, ei.codigo AS estado_codigo,
              (SELECT COALESCE(SUM(cantidad_disponible), 0) FROM LOTE_INSUMO WHERE id_insumo = i.id_insumo) AS stock_actual
       FROM INSUMO_CLINICO i
       JOIN ESTADO_INSUMO ei ON i.id_estado_insumo = ei.id_estado_insumo
       ORDER BY i.nombre`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener insumos.' });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT i.*, ei.nombre AS estado_nombre, ei.codigo AS estado_codigo
       FROM INSUMO_CLINICO i
       JOIN ESTADO_INSUMO ei ON i.id_estado_insumo = ei.id_estado_insumo
       WHERE i.id_insumo = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Insumo no encontrado.' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener insumo.' });
  }
};

const create = async (req, res) => {
  const { nombre, descripcion, categoria, unidad_medida, stock_minimo, id_estado_insumo } = req.body;
  if (!nombre || !categoria || !unidad_medida || !id_estado_insumo) {
    return res.status(400).json({ error: 'Campos requeridos: nombre, categoria, unidad_medida, id_estado_insumo.' });
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO INSUMO_CLINICO (nombre, descripcion, categoria, unidad_medida, stock_minimo, id_estado_insumo) VALUES (?,?,?,?,?,?)`,
      [nombre, descripcion || null, categoria, unidad_medida, stock_minimo || 0, id_estado_insumo]
    );
    const [created] = await pool.query('SELECT * FROM INSUMO_CLINICO WHERE id_insumo = ?', [result.insertId]);
    res.status(201).json(created[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear insumo.' });
  }
};

const update = async (req, res) => {
  const { nombre, descripcion, categoria, unidad_medida, stock_minimo, id_estado_insumo } = req.body;
  try {
    const [result] = await pool.query(
      `UPDATE INSUMO_CLINICO SET nombre=?, descripcion=?, categoria=?, unidad_medida=?, stock_minimo=?, id_estado_insumo=? WHERE id_insumo=?`,
      [nombre, descripcion, categoria, unidad_medida, stock_minimo, id_estado_insumo, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Insumo no encontrado.' });
    const [updated] = await pool.query('SELECT * FROM INSUMO_CLINICO WHERE id_insumo = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar insumo.' });
  }
};

const remove = async (req, res) => {
  try {
    // Desactivar cambiando estado
    const [estados] = await pool.query("SELECT id_estado_insumo FROM ESTADO_INSUMO WHERE codigo = 'DESCONTINUADO'");
    if (estados.length === 0) return res.status(500).json({ error: 'Estado DESCONTINUADO no configurado.' });
    const [result] = await pool.query(
      'UPDATE INSUMO_CLINICO SET id_estado_insumo=? WHERE id_insumo=?',
      [estados[0].id_estado_insumo, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Insumo no encontrado.' });
    res.json({ message: 'Insumo descontinuado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar insumo.' });
  }
};

// GET /api/insumos/:id/stock - stock total disponible
const getStock = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT SUM(cantidad_disponible) AS stock_total, COUNT(*) AS num_lotes
       FROM LOTE_INSUMO WHERE id_insumo = ? AND fecha_vencimiento > NOW()`,
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener stock.' });
  }
};

// POST /api/insumos/:id/stock - añadir stock rápido (crea lote automático)
const addStock = async (req, res) => {
  const { cantidad } = req.body;
  if (!cantidad || cantidad <= 0) return res.status(400).json({ error: 'Cantidad inválida.' });

  try {
    // Buscar un proveedor genérico o el primero disponible
    const [provs] = await pool.query('SELECT id_proveedor FROM PROVEEDOR LIMIT 1');
    if (provs.length === 0) {
      // Si no hay proveedores, creamos uno de sistema
      const [resProv] = await pool.query("INSERT INTO PROVEEDOR (nombre_proveedor, contacto) VALUES ('Genérico', 'Sistema')");
      provs.push({ id_proveedor: resProv.insertId });
    }
    
    const id_proveedor = provs[0].id_proveedor;
    const numero_lote = 'L-' + Date.now().toString().slice(-6);
    const fecha_ingreso = new Date().toISOString().split('T')[0];
    
    // Vence en 1 año por defecto para ingresos rápidos
    const dateVenc = new Date();
    dateVenc.setFullYear(dateVenc.getFullYear() + 1);
    const fecha_vencimiento = dateVenc.toISOString().split('T')[0];

    await pool.query(
      `INSERT INTO LOTE_INSUMO (id_insumo, id_proveedor, numero_lote, fecha_ingreso, fecha_vencimiento, cantidad_inicial, cantidad_disponible, observaciones)
       VALUES (?,?,?,?,?,?,?,?)`,
      [req.params.id, id_proveedor, numero_lote, fecha_ingreso, fecha_vencimiento, cantidad, cantidad, 'Ingreso manual rápido']
    );
    res.json({ message: 'Stock añadido correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al añadir stock rápido.' });
  }
};

module.exports = { getAll, getById, create, update, remove, getStock, addStock };
