const pool = require('../database/connection');

// GET /api/odontograma/:id_paciente
const getByPaciente = async (req, res) => {
  const { id_paciente } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM ODONTOGRAMA WHERE id_paciente = ? ORDER BY updated_at DESC LIMIT 1',
      [id_paciente]
    );
    if (rows.length === 0) {
      return res.json({ id_paciente: parseInt(id_paciente), datos: null });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener odontograma:', error);
    res.status(500).json({ error: 'Error al obtener odontograma.' });
  }
};

// POST /api/odontograma/:id_paciente  (Upsert)
const save = async (req, res) => {
  const { id_paciente } = req.params;
  const { datos } = req.body;

  if (!datos) {
    return res.status(400).json({ error: 'El campo datos es requerido.' });
  }

  try {
    // Check if already exists
    const [existing] = await pool.query(
      'SELECT id_odontograma FROM ODONTOGRAMA WHERE id_paciente = ?',
      [id_paciente]
    );

    if (existing.length > 0) {
      await pool.query(
        'UPDATE ODONTOGRAMA SET datos = ?, updated_at = NOW() WHERE id_paciente = ?',
        [JSON.stringify(datos), id_paciente]
      );
    } else {
      await pool.query(
        'INSERT INTO ODONTOGRAMA (id_paciente, datos) VALUES (?, ?)',
        [id_paciente, JSON.stringify(datos)]
      );
    }

    const [saved] = await pool.query(
      'SELECT * FROM ODONTOGRAMA WHERE id_paciente = ?',
      [id_paciente]
    );
    res.json(saved[0]);
  } catch (error) {
    console.error('Error al guardar odontograma:', error);
    res.status(500).json({ error: 'Error al guardar odontograma.' });
  }
};

module.exports = { getByPaciente, save };
