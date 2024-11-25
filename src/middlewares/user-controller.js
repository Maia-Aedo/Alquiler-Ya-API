/**
 * @description Los controladores manejan la lógica de nuestra aplicación.
 * 
 */

const { request, response } = require("express");
const { getConnection } = require("../database/database");
const bcrypt = require("bcrypt");
const { generateJwt } = require("../middlewares/jwt");

const register = async (req = request, res = response) => {
  const user = { ...req.body };

  // Valor aleatorio para generar hasheo
  const salt = 12;

  if (!user) res.status(401).json({ ok: false, msg: "No autorizado" });

  try {
    
    user.password = await bcrypt.hash(user.password, salt);

    const connection = await getConnection();

    const result = await connection.query("INSERT INTO usuarios SET ?", user);

    res.status(201).json({ ok: true, result, msg: "approved" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ ok: false, e, msg: "Server error" });
  }
};

const login = async (req = request, res = response) => {
  const user = { ...req.body };

  if (!user) res.status(401).json({ ok: false, msg: "No autorizado" });
  
  try {
    const connection = await getConnection();
    const [result] = await connection.query(
      "SELECT * FROM usuarios WHERE username = ?",
      user.username
    );

    if(!result[0]) res.status(404).json({ ok: false, msg: "Usuario no encontrado" });

    // Compara contraseña hasheada con la del usuario
    const isPassword = await bcrypt.compare(user.password, result[0].password);

    if (isPassword) {
      const token = await generateJwt(result[0]);
      res.status(200).json({ ok: true, token, msg: "login" });
    } else {
      res.status(401).json({ ok: false, msg: "Contraseña incorrecta" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, e, msg: "Server error" });
  }
};

const getOne = async (req = request, res = response) => {
  console.log("Parámetros", req.params);
  const id = req.params.id;
  console.log("ID provisto?", id);

  if (!id) {
    res.status(404).json({ ok: false, msg: "El parámetro no fue provisto" });
  }

  console.log("Paso el 404 Not Found");

  try {
    const connection = await getConnection();
    const [result] = await connection.query(
      "SELECT * FROM usuarios WHERE id = ?",
      id
    );

    res.status(200).json({ ok: true, result, msg: "approved" });
  } catch (error) {
    console.error(e);
    res.status(500).json({ ok: false, msg: "Server error" });
  }
};

module.exports = { register, login, getOne };