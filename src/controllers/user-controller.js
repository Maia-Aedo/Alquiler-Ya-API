/**
 * @module controller/user-controller
 */

const { request, response } = require("express");
const { AppDataSource } = require("../database/database");
const bcrypt = require("bcrypt");
const { generateJwt } = require("../middlewares/jwt");

// obtenemos el repositorio de Usuario
const Usuario = require("../database/entities/User");

/**
 * Registra un nuevo usuario
 */
const register = async (req = request, res = response) => {
  const { username, password, email, rol } = req.body;

  if (!username || !password || !email || !rol) {
    return res.status(400).json({ ok: false, msg: "Todos los campos son obligatorios" });
  }

  try {
    const userRepo = AppDataSource.getRepository("Usuario");

    // verificar si ya existe
    const exist = await userRepo.findOne({ where: { username } });
    if (exist) {
      return res.status(400).json({ ok: false, msg: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = userRepo.create({
      username,
      password: hashedPassword,
      email,
      rol,
    });

    const savedUser = await userRepo.save(newUser);

    res.status(201).json({ ok: true, msg: "Usuario registrado", id: savedUser.id });
  } catch (e) {
    console.error("Error en registro:", e.message);
    res.status(500).json({ ok: false, msg: "Error en el servidor", error: e.message });
  }
};

/**
 * Login de usuario
 */
const login = async (req = request, res = response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ ok: false, msg: "Credenciales incompletas" });
  }

  try {
    const userRepo = AppDataSource.getRepository("Usuario");
    const user = await userRepo.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(401).json({ ok: false, msg: "Contraseña incorrecta" });
    }

    const token = await generateJwt({
      id: user.id,
      username: user.username,
      rol: user.rol,
    });

    res.status(200).json({ ok: true, token, msg: "Login exitoso" });
  } catch (e) {
    console.error("Error en login:", e.message);
    res.status(500).json({ ok: false, msg: "Error en el servidor", error: e.message });
  }
};

/**
 * Obtiene un usuario por ID
 */
const getOne = async (req = request, res = response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ ok: false, msg: "ID no proporcionado" });
  }

  try {
    const userRepo = AppDataSource.getRepository("Usuario");
    const user = await userRepo.findOne({ where: { id: parseInt(id) } });

    if (!user) {
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }

    res.status(200).json({ ok: true, msg: "Usuario obtenido", usuario: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error en el servidor" });
  }
};

module.exports = { register, login, getOne };
