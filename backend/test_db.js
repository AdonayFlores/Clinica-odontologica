const pool = require('./src/database/connection');
async function test() {
  try {
    const [citas] = await pool.query('SELECT * FROM CITA ORDER BY id_cita DESC LIMIT 1');
    if(citas.length > 0) {
      const cita = citas[0];
      console.log('Cita:', cita);
      await pool.query('UPDATE CITA SET id_estado_cita=2, fecha_cita=? WHERE id_cita=?', [cita.fecha_cita, cita.id_cita]);
      console.log('Update successful using raw JS Date');
      const isoString = new Date(cita.fecha_cita).toISOString();
      await pool.query('UPDATE CITA SET id_estado_cita=2, fecha_cita=? WHERE id_cita=?', [isoString, cita.id_cita]);
      console.log('Update successful using ISO string');
    }
  } catch (e) {
    console.error('Error:', e);
  } finally {
    process.exit(0);
  }
}
test();
