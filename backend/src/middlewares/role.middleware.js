/**
 * Middleware de autorización por rol.
 * Uso: requireRole('admin') o requireRole(['admin', 'asistente'])
 */
const requireRole = (...roles) => {
  const allowed = roles.flat(); // acepta string o array
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado.' });
    }
    if (!allowed.includes(req.user.rol)) {
      return res.status(403).json({
        error: `Acceso denegado. Se requiere rol: ${allowed.join(' o ')}.`,
      });
    }
    next();
  };
};

module.exports = requireRole;
