const pool = require('../database/connection');

const getAll = async (req, res) => {
  const id_usuario = req.user.id_usuario;
  try {
    const [rows] = await pool.query(
      `SELECT n.*, tn.nombre AS tipo_nombre, tn.codigo AS tipo_codigo
       FROM NOTIFICACION n
       JOIN TIPO_NOTIFICACION tn ON n.id_tipo_notificacion = tn.id_tipo_notificacion
       WHERE n.id_usuario = ?
       ORDER BY n.fecha_envio DESC`,
      [id_usuario]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener notificaciones.' });
  }
};

const markRead = async (req, res) => {
  const id_usuario = req.user.id_usuario;
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      'UPDATE NOTIFICACION SET leida=TRUE WHERE id_notificacion=? AND id_usuario=?',
      [id, id_usuario]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Notificación no encontrada.' });
    res.json({ message: 'Notificación marcada como leída.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al marcar notificación.' });
  }
};

const markAllRead = async (req, res) => {
  const id_usuario = req.user.id_usuario;
  try {
    await pool.query('UPDATE NOTIFICACION SET leida=TRUE WHERE id_usuario=?', [id_usuario]);
    res.json({ message: 'Todas las notificaciones marcadas como leídas.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al marcar notificaciones.' });
  }
};

const create = async (req, res) => {
  const { id_usuario, titulo, mensaje, id_tipo_notificacion } = req.body;
  if (!id_usuario || !titulo || !mensaje || !id_tipo_notificacion) {
    return res.status(400).json({ error: 'Campos requeridos: id_usuario, titulo, mensaje, id_tipo_notificacion.' });
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO NOTIFICACION (id_usuario, titulo, mensaje, id_tipo_notificacion) VALUES (?,?,?,?)`,
      [id_usuario, titulo, mensaje, id_tipo_notificacion]
    );
    const [created] = await pool.query('SELECT * FROM NOTIFICACION WHERE id_notificacion = ?', [result.insertId]);
    res.status(201).json(created[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear notificación.' });
  }
};

module.exports = { getAll, markRead, markAllRead, create };
