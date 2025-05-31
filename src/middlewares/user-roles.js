/**
 * @module middlewares/user-roles
 * @description Middleware para verificar si el usuario autenticado tiene un rol autorizado.
 */

/**
 * Middleware para verificar el rol del usuario autenticado.
 *
 * @function verifyRole
 * @param {string[]} allowedRoles - Array de roles permitidos (por ejemplo, ['admin', 'propietario']).
 * @returns {Function} Middleware de Express que valida el rol del usuario.
 *
 * @example
 * // Usado en rutas protegidas
 * router.post('/ruta-protegida', authenticateJWT, verifyRole(['admin']), handler);
 */

const verifyRole = (allowedRoles) => (req, res, next) => {
    const user = req.usuario;
    // Si no hay usuario en la request, no está autenticado
    if (!user) {
        return res.status(401).json({ ok: false, msg: "Usuario no autenticado" });
    }
    // Si el rol del usuario no está permitido, denegamos acceso
    if (!allowedRoles.includes(user.rol)) {
        return res.status(403).json({
            ok: false,
            msg: "No tienes permiso para realizar esta acción",
        });
    }
    // Si todo está bien, pasamos al siguiente middleware/controlador
    next();
};

module.exports = { verifyRole };