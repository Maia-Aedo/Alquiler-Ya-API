/**
 * @description Comprobamos si el token de la petición tiene firma válida y es auténtico.
 * @description function generateJwt genera el payload con la información del usuario y establece expiración.
 */

const jwt = require("jsonwebtoken");
const config = require("../config");
const { response, request } = require("express");

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

// Genera un nuevo token JWT
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