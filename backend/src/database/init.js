require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql2 = require('mysql2/promise');

async function initDatabase() {
  const conn = await mysql2.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    console.log('🔗 Conectado a MySQL...');
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await conn.query(sql);
    console.log('✅ Base de datos inicializada correctamente!');
    console.log('📊 Tablas creadas y datos iniciales insertados.');
    console.log('');
    console.log('👤 Usuarios de prueba:');
    console.log('   admin@clinica.com    | password: password');
    console.log('   doctor@clinica.com   | password: password');
    console.log('   asistente@clinica.com| password: password');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error.message);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

initDatabase();
