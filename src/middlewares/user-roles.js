// Verificamos el rol del usuario
// Fn recibe role - dependiendo de rol, permite acceso a determinadas rutas
const verifyRole = (rol) => {
    return (req, res, next) => {
        if (req.user.rol !== rol) {
            return res.status(403).json({ ok:false, msg:"Sin permisos" });
        }
        next();
    };
};

module.exports = { verifyRole };