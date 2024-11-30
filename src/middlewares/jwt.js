/**
 * @description Comprobamos si el token de la petición tiene firma válida y es auténtico.
 * @description function generateJwt genera el payload con la información del usuario y establece expiración.
 */

const jwt = require("jsonwebtoken");
const config = require("../config");
const { response, request } = require("express");

const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ ok: false, msg: "No autenticado" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;
    next();
  } catch (error) {
    return res.status(401).json({ ok: false, msg: "Token inválido" });
  }
};

const generateJwt = async (user) => {
    const payload = {
    sub: user.id,
    username: user.usuario,
    name: user.nombre,
  };

  const options = {
    expiresIn: "24h",
  };
  // Retornamos el token
  return jwt.sign(payload, config.secretKey, options);
};

module.exports = { authenticateJWT, generateJwt };


