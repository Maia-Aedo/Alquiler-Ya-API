/**
 * @description Los controladores manejan la lógica de nuestra aplicación.
 * @description Function registerAdmin registrará nuevo usuario con rol de administrador.
 * @description Function register registra usuario común.
 * @description Function login inicio de sesión
 * @description Function getUser obtiene un usuario en específico
 */

const { request, response } = require("express");
const { getConnection } = require("../database/database");
const bcrypt = require("bcrypt");
const { generateJwt } = require("../middlewares/jwt");

const register = async (req = request, res = response) => {
  const { username, password, email, rol = "cliente" } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ ok: false, msg: "Todos los campos son obligatorios" });
  }

  try {
    const salt = 12;
    const hashedPassword = await bcrypt.hash(password, salt);

    const connection = await getConnection();
    const result = await connection.query(
      "INSERT INTO users (username, password, email, rol) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, email, rol]
    );

    res.status(201).json({ ok: true, msg: "Usuario registrado", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error en el servidor" });
  }
};


const registerOwner = async (req = request, res = response) => {
  const { username, password, email, rol = "propietario" } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ ok: false, msg: "Todos los campos son obligatorios" });
  }

  try {
    const salt = 12;
    const hashedPassword = await bcrypt.hash(password, salt);

    const connection = await getConnection();
    const result = await connection.query(
      "INSERT INTO users (username, password, email, rol) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, email, rol]
    );

    res.status(201).json({ ok: true, msg: "Propietario registrado", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error en el servidor" });
  }
};

const registerAdmin = async (req = request, res = response) => {
  const { username, password, email, rol = "admin" } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ ok: false, msg: "Todos los campos son obligatorios" });
  }

  try {
    const salt = 12;
    const hashedPassword = await bcrypt.hash(password, salt);

    const connection = await getConnection();
    const result = await connection.query(
      "INSERT INTO users (username, password, email, rol) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, email, rol]
    );

    res.status(201).json({ ok: true, msg: "Administrador registrado", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error en el servidor" });
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
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ ok: false, msg: "Contraseña incorrecta" });
    }

    const token = await generateJwt(user);
    res.status(200).json({ ok: true, msg: "Login exitoso", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error en el servidor" });
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

module.exports = { register,  registerOwner, registerAdmin, login, getOne };
