const pool = require('../database/connection');

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT cc.*, 
              u.nombre AS odontologo_nombre, u.apellido AS odontologo_apellido,
              p.nombres AS paciente_nombres, p.apellidos AS paciente_apellidos
       FROM CONSULTA_CLINICA cc
       JOIN ODONTOLOGO o ON cc.id_odontologo = o.id_odontologo
       JOIN USUARIO u ON o.id_usuario = u.id_usuario
       JOIN HISTORIAL_CLINICO hc ON cc.id_historial = hc.id_historial
       JOIN PACIENTE p ON hc.id_paciente = p.id_paciente
       ORDER BY cc.fecha_consulta DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener consultas.' });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT cc.*, u.nombre AS odontologo_nombre, u.apellido AS odontologo_apellido
       FROM CONSULTA_CLINICA cc
       JOIN ODONTOLOGO o ON cc.id_odontologo = o.id_odontologo
       JOIN USUARIO u ON o.id_usuario = u.id_usuario
       WHERE cc.id_consulta = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Consulta no encontrada.' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener consulta.' });
  }
};

const create = async (req, res) => {
  const { id_paciente, id_historial, id_cita, id_odontologo, fecha_consulta, motivo_consulta, diagnostico, tratamiento, notas, insumos_utilizados } = req.body;
  if ((!id_historial && !id_paciente) || !id_odontologo || !fecha_consulta || !motivo_consulta || !diagnostico || !tratamiento) {
    return res.status(400).json({ error: 'Campos requeridos: id_paciente (o id_historial), id_odontologo, fecha_consulta, motivo_consulta, diagnostico, tratamiento.' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let finalIdHistorial = id_historial;
    if (!finalIdHistorial && id_paciente) {
      const [hc] = await conn.query('SELECT id_historial FROM HISTORIAL_CLINICO WHERE id_paciente = ?', [id_paciente]);
      if (hc.length > 0) {
        finalIdHistorial = hc[0].id_historial;
      } else {
        // Create clinical history automatically if it doesn't exist
        const [insertHc] = await conn.query(
          'INSERT INTO HISTORIAL_CLINICO (id_paciente, observaciones) VALUES (?, ?)',
          [id_paciente, 'Historial creado automáticamente en primera consulta']
        );
        finalIdHistorial = insertHc.insertId;
      }
    }

    // 1. Crear la consulta
    const [result] = await conn.query(
      `INSERT INTO CONSULTA_CLINICA (id_historial, id_cita, id_odontologo, fecha_consulta, motivo_consulta, diagnostico, tratamiento, notas) VALUES (?,?,?,?,?,?,?,?)`,
      [finalIdHistorial, id_cita || null, id_odontologo, fecha_consulta, motivo_consulta, diagnostico, tratamiento, notas || null]
    );
    const id_consulta = result.insertId;

    // 2. Procesar insumos utilizados (Descargo de inventario FIFO)
    if (insumos_utilizados && Array.isArray(insumos_utilizados) && insumos_utilizados.length > 0) {
      // Pre-validation: check available stock before discounting
      const stockInsuficiente = [];
      for (const item of insumos_utilizados) {
        const cantidad = parseInt(item.cantidad);
        if (isNaN(cantidad) || cantidad <= 0) continue;
        const [stockRows] = await conn.query(
          `SELECT COALESCE(SUM(cantidad_disponible), 0) AS total_disponible, i.nombre
           FROM LOTE_INSUMO l
           JOIN INSUMO_CLINICO i ON l.id_insumo = i.id_insumo
           WHERE l.id_insumo = ? AND l.cantidad_disponible > 0 AND l.fecha_vencimiento >= CURDATE()`,
          [item.id_insumo]
        );
        const disponible = parseInt(stockRows[0]?.total_disponible || '0');
        if (disponible < cantidad) {
          stockInsuficiente.push({
            nombre: stockRows[0]?.nombre || `Insumo #${item.id_insumo}`,
            solicitado: cantidad,
            disponible
          });
        }
      }
      if (stockInsuficiente.length > 0) {
        await conn.rollback();
        const detalles = stockInsuficiente.map(s => `${s.nombre}: solicitado ${s.solicitado}, disponible ${s.disponible}`).join('; ');
        return res.status(400).json({
          error: `Stock insuficiente para los siguientes insumos: ${detalles}. Revisa el inventario antes de guardar la consulta.`
        });
      }

      for (const item of insumos_utilizados) {
        let cantidadFaltante = parseInt(item.cantidad);
        if (isNaN(cantidadFaltante) || cantidadFaltante <= 0) continue;

        // Buscar lotes disponibles ordenados por fecha de vencimiento (próximos a vencer primero)
        const [lotes] = await conn.query(
          `SELECT id_lote, cantidad_disponible 
           FROM LOTE_INSUMO 
           WHERE id_insumo = ? AND cantidad_disponible > 0 AND fecha_vencimiento >= CURDATE()
           ORDER BY fecha_vencimiento ASC`,
          [item.id_insumo]
        );

        for (const lote of lotes) {
          if (cantidadFaltante <= 0) break;

          const descuento = Math.min(lote.cantidad_disponible, cantidadFaltante);
          
          // Actualizar cantidad en el lote
          await conn.query(
            `UPDATE LOTE_INSUMO SET cantidad_disponible = cantidad_disponible - ? WHERE id_lote = ?`,
            [descuento, lote.id_lote]
          );

          // Registrar movimiento de salida
          await conn.query(
            `INSERT INTO MOVIMIENTO_INVENTARIO (id_lote, id_usuario, tipo_movimiento, motivo, observaciones) VALUES (?, ?, ?, ?, ?)`,
            [lote.id_lote, req.user.id_usuario, 'SALIDA', `CONSULTA-${id_consulta}`, `Uso en consulta clínica. Cantidad: ${descuento}`]
          );

          cantidadFaltante -= descuento;
        }
      }
    }

    await conn.commit();
    
    const [created] = await conn.query('SELECT * FROM CONSULTA_CLINICA WHERE id_consulta = ?', [id_consulta]);
    res.status(201).json(created[0]);
  } catch (error) {
    await conn.rollback();
    console.error('Error al crear consulta:', error);
    res.status(500).json({ error: 'Error al crear consulta y descargar inventario.', details: error.message });
  } finally {
    conn.release();
  }
};

const update = async (req, res) => {
  const { motivo_consulta, diagnostico, tratamiento, notas } = req.body;
  try {
    const [result] = await pool.query(
      `UPDATE CONSULTA_CLINICA SET motivo_consulta=?, diagnostico=?, tratamiento=?, notas=? WHERE id_consulta=?`,
      [motivo_consulta, diagnostico, tratamiento, notas, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Consulta no encontrada.' });
    const [updated] = await pool.query('SELECT * FROM CONSULTA_CLINICA WHERE id_consulta = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar consulta.' });
  }
};

module.exports = { getAll, getById, create, update };
