/**
 * @description Comprobamos si el token de la petición tiene firma válida y es auténtico.
 * @description function generateJwt genera el payload con la información del usuario y establece expiración.
 */

const jwt = require("jsonwebtoken");
const config = require("../config");
const { response, request, next } = require("express");

const authenticateJWT = (req = request, res = response, next = next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, config.secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    // Guardamos el usuario en el request para usar en rutas protegidas
    req.user = user; 
    next();
  });
};

const generateJwt = async (user) => {
    const payload = {
    sub: user.id,
    username: user.username,
    name: user.nombre,
  };

  const options = {
    expiresIn: "24h",
  };
  // Retornamos el token
  return jwt.sign(payload, config.secretKey, options);
};

module.exports = { authenticateJWT, generateJwt };


