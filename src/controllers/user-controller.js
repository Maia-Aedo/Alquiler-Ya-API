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

const registerAdmin = async (req = request, res = response) => {
  const user = { ...req.body };
  if (!user || !user.password || !user.usuario) {
    return res.status(400).json({ ok: false, msg: "Datos insuficientes" });
  }
  
  try {
    const salt = 12;
    // Cambiamos contrasena por la nueva hasheada
    user.password = await bcrypt.hash(user.password, salt);
    user.rol = 'admin'

    const connection = await getConnection();
    // Pasamos la query donde insertamos el nuevo user en la tabla
    const [result] = await connection.execute('INSERT INTO usuarios SET ?', user);
    
    if (result.length === 0) return null;
    res.status(201).json({ ok: true, result, msg: "Admin creado" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ ok: false, e, msg: "Error en servidor" });
  }
};

const registerOwner = async (req = request, res = response) => {
  const user = { ...req.body };
  if (!user || !user.password || !user.usuario) {
    return res.status(400).json({ ok: false, msg: "Datos insuficientes" });
  }

  try {
    const salt = 12;
    user.password = await bcrypt.hash(user.password, salt);
    user.rol = 'propietario'

    const connection = await getConnection();
    const [result] = await connection.execute('INSERT INTO usuarios SET ?', user);
    
    if (result.length === 0) return null;
    res.status(201).json({ ok: true, result, msg: "Propietario creado" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ ok: false, e, msg: "Error en servidor" });
  }
};

const register = async (req = request, res = response) => {
  const user = { ...req.body };
  if (!user || !user.password || !user.usuario) {
    return res.status(400).json({ ok: false, msg: "Datos insuficientes" });
  }
  
  try {
    // Valor aleatorio para generar hasheo
    const salt = 12;
    user.password = await bcrypt.hash(user.password, salt);
    user.rol = 'usuario'

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
  if (!user || !user.password || !user.usuario) {
    return res.status(400).json({ ok: false, msg: "Datos insuficientes" });
  }

  try {
    const connection = await getConnection();
    const [result] = await connection.query(
      "SELECT * FROM usuarios WHERE usuario = ?",
      user.usuario
    );

    if (!result[0]) res.status(404).json({ ok: false, msg: "Usuario no encontrado" });

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

const getUser = async (req = request, res = response) => {
  console.log("Parámetros", req.params);
  const id = req.params.id;
  console.log("ID provisto?", id);

  if (!id) return res.status(404).json({ ok: false, msg: "El parámetro no fue provisto" });
  console.log("Paso el 404 Not Found");

  try {
    const connection = await getConnection();
    const [result] = await connection.query(
      "SELECT * FROM usuarios WHERE id = ?",
      id
    );
    res.status(200).json({ ok: true, result, msg: "approved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Server error" });
  }
};

module.exports = { register, registerAdmin, registerOwner, login, getUser };