const mysql2 = require('mysql2/promise');

const pool = mysql2.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clinica_odontologica',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: 'local',
  dateStrings: true
});

// Probar conexión al iniciar
pool.getConnection()
  .then(conn => {
    console.log('Conexión a MySQL establecida correctamente');
    conn.release();
  })
  .catch(err => {
    console.error('Error al conectar a MySQL:', err.message);
    console.error('Verifica las credenciales en el archivo .env');
  });

module.exports = pool;
