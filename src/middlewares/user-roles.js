// Verificamos el rol del usuario
// Fn recibe roles permitidos - dependiendo de rol, permite acceso a determinadas rutas
const verifyRole = (allowedRoles) => {
    return (req, res, next) => {
        const { rol } = req.usuario; // Usuario autenticado debe incluir el rol en el payload del JWT
        if (!allowedRoles.includes(rol)) {
            return res.status(403).json({
                ok: false,
                msg: "No tienes permiso para realizar esta acción",
            });
        }
        next();
    };
};

module.exports = { verifyRole };