/**
 * @description Los controladores manejan la lógica de nuestra aplicación.
 * @description Function register registra usuario.
 * @description Function login inicio de sesión
 * @description Function getUser obtiene un usuario en específico
 */

const { request, response } = require("express");
const { getConnection } = require("../database/database");
const bcrypt = require("bcrypt");
const { generateJwt } = require("../middlewares/jwt");

const register = async (req = request, res = response) => {
  const { username, password, email, rol } = req.body;
  const salt = 12;

  if (!username || !password || !email || !rol ) {
    return res.status(400).json({ ok: false, msg: "Todos los campos son obligatorios" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, salt);

    const connection = await getConnection();
    const result = await connection.query(
      "INSERT INTO users (username, password, email, rol) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, email, rol]
    );

    res.status(201).json({ ok: true, msg: "Usuario registrado", id: result.insertId });
  } catch (e) {
    console.error('Error en registro:', e.message);
    res.status(500).json({ ok: false, msg: "Error en el servidor", error: e.message });
  }
};

const login = async (req = request, res = response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ ok: false, msg: "Credenciales incompletas" });
  }

  try {
    const connection = await getConnection();
    const [result] = await connection.query("SELECT * FROM users WHERE username = ?", [username]);

    if (!result.length) {
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }

    const user = result[0];
    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) {
      return res.status(401).json({ ok: false, msg: "Contraseña incorrecta" });
    }

    const token = await generateJwt({
      id: user.id,
      username: user.username,
      rol: user.rol
    });

    res.status(200).json({ ok: true, token, msg: 'Login exitoso' });
  } catch (e) {
    console.error('Error en login:', e.message);
    res.status(500).json({ ok: false, msg: "Error en el servidor", error: e.message });
  }
};

const getOne = async (req = request, res = response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ ok: false, msg: "ID no proporcionado" });
  }

  try {
    const connection = await getConnection();
    const [result] = await connection.query("SELECT * FROM users WHERE id = ?", [id]);

    if (!result.length) {
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }

    res.status(200).json({ ok: true, msg: "Usuario obtenido", usuario: result[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error en el servidor" });
  }
};

module.exports = { register, login, getOne };
