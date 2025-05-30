// Verificamos el rol del usuario
// Fn recibe roles permitidos - dependiendo de rol, permite acceso a determinadas rutas

// Middleware para verificar el rol del usuario
const verifyRole = (allowedRoles) => (req, res, next) => {
    const user = req.usuario;

    if (!user) {
        return res.status(401).json({ ok: false, msg: "Usuario no autenticado" });
    }

    if (!allowedRoles.includes(user.rol)) {
        return res.status(403).json({
            ok: false,
            msg: "No tienes permiso para realizar esta acción",
        });
    }

    next();
};

module.exports = { verifyRole };