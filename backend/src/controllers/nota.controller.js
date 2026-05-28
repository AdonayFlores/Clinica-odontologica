const pool = require('../database/connection');

// GET /api/notas/paciente/:id_paciente
const getByPaciente = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT n.*, u.nombre AS autor_nombre, u.apellido AS autor_apellido
       FROM NOTA_CLINICA n
       JOIN USUARIO u ON n.id_usuario = u.id_usuario
       WHERE n.id_paciente = ?
       ORDER BY n.fecha_nota DESC`,
      [req.params.id_paciente]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener notas:', error);
    res.status(500).json({ error: 'Error al obtener notas clínicas.' });
  }
};

// POST /api/notas
const create = async (req, res) => {
  const { id_paciente, titulo, contenido, categoria } = req.body;
  if (!id_paciente || !titulo || !contenido) {
    return res.status(400).json({ error: 'Campos requeridos: id_paciente, titulo, contenido.' });
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO NOTA_CLINICA (id_paciente, id_usuario, titulo, contenido, categoria) VALUES (?,?,?,?,?)`,
      [id_paciente, req.user.id_usuario, titulo, contenido, categoria || 'general']
    );
    const [created] = await pool.query(
      `SELECT n.*, u.nombre AS autor_nombre, u.apellido AS autor_apellido
       FROM NOTA_CLINICA n
       JOIN USUARIO u ON n.id_usuario = u.id_usuario
       WHERE n.id_nota = ?`,
      [result.insertId]
    );
    res.status(201).json(created[0]);
  } catch (error) {
    console.error('Error al crear nota:', error);
    res.status(500).json({ error: 'Error al crear nota clínica.' });
  }
};

// DELETE /api/notas/:id
const remove = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id_nota FROM NOTA_CLINICA WHERE id_nota = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Nota no encontrada.' });
    await pool.query('DELETE FROM NOTA_CLINICA WHERE id_nota = ?', [req.params.id]);
    res.json({ message: 'Nota eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar nota.' });
  }
};

module.exports = { getByPaciente, create, remove };
