const pool = require('../database/connection');
const jwt = require('jsonwebtoken');

const logMiddleware = async (req, res, next) => {
  // Extraer token para identificar al usuario de forma no intrusiva
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  let id_usuario = null;

  if (token) {
    try {
      const decoded = jwt.decode(token);
      if (decoded) {
        id_usuario = decoded.id_usuario;
      }
    } catch (e) {
      // Ignorar fallos de decode
    }
  }

  // Obtener IP y detalles
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  const metodo = req.method;
  const ruta = req.originalUrl || req.url;

  // Filtrar información sensible (contraseñas) de los logs
  let bodyCopy = { ...req.body };
  if (bodyCopy.password) bodyCopy.password = '***';
  if (bodyCopy.password_hash) bodyCopy.password_hash = '***';

  const detalles = JSON.stringify({
    query: Object.keys(req.query).length ? req.query : undefined,
    body: metodo !== 'GET' && Object.keys(bodyCopy).length ? bodyCopy : undefined
  });

  // Guardar log de forma asíncrona para no bloquear el flujo principal
  pool.query(
    'INSERT INTO LOG_ACTIVIDAD (id_usuario, metodo, ruta, ip, detalles) VALUES (?, ?, ?, ?, ?)',
    [id_usuario, metodo, ruta, ip, detalles]
  ).catch(err => {
    console.error('Error al escribir log de actividad:', err);
  });

  next();
};

module.exports = logMiddleware;
