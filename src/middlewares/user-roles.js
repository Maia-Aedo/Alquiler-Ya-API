// Verificamos el rol del usuario
// Fn recibe rol - dependiendo de rol, permite acceso a determinadas rutas
const verifyRole = (roles) => {
    return (req, res, next) => {
        const { rol } = req.usuario; // Obtenemos rol del user desde token
        if (!roles.includes(rol)) {
            return res.status(403).json({ ok: false, msg: "Acceso denegado" });
        }
        next();
    };
};

module.exports = { verifyRole };