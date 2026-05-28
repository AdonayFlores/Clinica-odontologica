const pool = require('../database/connection');

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT m.*, l.numero_lote, i.nombre AS insumo_nombre,
              u.nombre AS usuario_nombre, u.apellido AS usuario_apellido
       FROM MOVIMIENTO_INVENTARIO m
       JOIN LOTE_INSUMO l ON m.id_lote = l.id_lote
       JOIN INSUMO_CLINICO i ON l.id_insumo = i.id_insumo
       JOIN USUARIO u ON m.id_usuario = u.id_usuario
       ORDER BY m.fecha_movimiento DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener movimientos.' });
  }
};

const create = async (req, res) => {
  const { id_lote, tipo_movimiento, cantidad, motivo, observaciones } = req.body;
  const id_usuario = req.user.id_usuario;

  if (!id_lote || !tipo_movimiento || !cantidad) {
    return res.status(400).json({ error: 'Campos requeridos: id_lote, tipo_movimiento, cantidad.' });
  }

  if (!['entrada', 'salida'].includes(tipo_movimiento.toLowerCase())) {
    return res.status(400).json({ error: 'tipo_movimiento debe ser "entrada" o "salida".' });
  }

  try {
    // Verificar stock disponible para salidas
    const [lote] = await pool.query('SELECT * FROM LOTE_INSUMO WHERE id_lote = ?', [id_lote]);
    if (lote.length === 0) return res.status(404).json({ error: 'Lote no encontrado.' });

    if (tipo_movimiento.toLowerCase() === 'salida' && lote[0].cantidad_disponible < cantidad) {
      return res.status(400).json({ error: `Stock insuficiente. Disponible: ${lote[0].cantidad_disponible}` });
    }

    // Registrar movimiento
    const [result] = await pool.query(
      `INSERT INTO MOVIMIENTO_INVENTARIO (id_lote, id_usuario, tipo_movimiento, motivo, observaciones) VALUES (?,?,?,?,?)`,
      [id_lote, id_usuario, tipo_movimiento, motivo || null, observaciones || null]
    );

    // Actualizar stock del lote
    const delta = tipo_movimiento.toLowerCase() === 'entrada' ? cantidad : -cantidad;
    await pool.query(
      'UPDATE LOTE_INSUMO SET cantidad_disponible = cantidad_disponible + ? WHERE id_lote = ?',
      [delta, id_lote]
    );

    const [created] = await pool.query('SELECT * FROM MOVIMIENTO_INVENTARIO WHERE id_movimiento = ?', [result.insertId]);
    res.status(201).json(created[0]);
  } catch (error) {
    console.error('Error al crear movimiento:', error);
    res.status(500).json({ error: 'Error al registrar movimiento.' });
  }
};

module.exports = { getAll, create };
