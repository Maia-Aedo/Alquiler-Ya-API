/**
 * @module middlewares/jwt
 * @description Middleware para verificar la validez de un token JWT y función para generar nuevos tokens.
 */

const jwt = require("jsonwebtoken");
const config = require("../config");
const { response, request } = require("express");

/**
 * Middleware que verifica si un JWT es válido.
 *
 * @function authenticateJWT
 * @param {Request} req - Objeto de solicitud de Express.
 * @param {Response} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {Response|void} Devuelve error si el token no es válido o continúa con la ejecución.
 *
 * @example
 * router.get('/ruta-protegida', authenticateJWT, controlador);
 */

const authenticateJWT = (req = request, res = response, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ ok: false, msg: "No autenticado" });
  }

  jwt.verify(token, config.secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ ok: false, msg: "Token inválido" });
    }

    req.usuario = user;
    next();
  });
};

/**
 * Genera un token JWT con la información del usuario.
 *
 * @async
 * @function generateJwt
 * @param {Object} user - Objeto que contiene datos del usuario.
 * @param {number} user.id - ID del usuario.
 * @param {string} user.username - Nombre de usuario.
 * @param {string} user.nombre - Nombre completo del usuario.
 * @param {string} user.rol - Rol del usuario (por defecto 'cliente').
 * @returns {Promise<string>} Token JWT firmado.
 *
 * @example
 * const token = await generateJwt(usuario);
 */

const generateJwt = async (user) => {
  const payload = {
    id: user.id,
    username: user.username || user.usuario,
    name: user.nombre || user.name,
    rol: user.rol || "cliente",
  };

  const options = {
    expiresIn: "24h",
  };

  return jwt.sign(payload, config.secretKey, options);
};

// Exportamos todo
module.exports = { authenticateJWT, generateJwt };