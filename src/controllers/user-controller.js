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
  const { email, nombreUsuario, contrasena, nombre, apellido } = req.body;
  if (!email || !nombreUsuario || !contrasena || !nombre || !apellido) {
    return res.status(400).json({ ok: false, msg: "Datos insuficientes" });
  }
  
  try {
    const salt = 12;
    // Cambiamos contrasena por la nueva hasheada
    const hashContrasena = await bcrypt.hash(contrasena, salt);

    const connection = await getConnection();
    // Pasamos la query donde insertamos el nuevo user en la tabla Usuario
    const [result] = await connection.execute(
      "INSERT INTO Usuario (email, nombreUsuario, contrasena) VALUES (?, ?, ?)",
      [email, nombreUsuario, hashedcontrasena]
    );

    const userId = result.insertId;

    // Inserta en tabla propietario //TODO más adelante cambiar a admin
    await connection.execute(
      "INSERT INTO Propietario (id, cuil, nombre, apellido) VALUES (?, NULL, ?, ?)",
      [userId, nombre, apellido]
    );
    
    if (result.length === 0) return null;
    res.status(201).json({ ok: true, result, msg: "Admin creado" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ ok: false, e, msg: "Error en servidor" });
  }
};

const registerOwner = async (req = request, res = response) => {
  const { email, nombreUsuario, contrasena, nombre, apellido, cuil } = req.body;

  if (!email || !nombreUsuario || !contrasena|| !nombre || !apellido || !cuil) {
    return res.status(400).json({ ok: false, msg: "Datos insuficientes" });
  }

  try {
    const salt = 12;
    const hashContrasena = await bcrypt.hash(contrasena, salt);

    const connection = await getConnection();
    const [result] = await connection.execute(
      "INSERT INTO Usuario (email, nombreUsuario, contrasena) VALUES (?, ?, ?)",
      [email, nombreUsuario, hashedcontrasena]
    );

    const userId = result.insertId;

    // Inserta en tabla Propietario
    await connection.execute(
      "INSERT INTO Propietario (id, cuil, nombre, apellido) VALUES (?, ?, ?, ?)",
      [userId, cuil, nombre, apellido]
    );
    
    if (result.length === 0) return null;
    res.status(201).json({ ok: true, result, msg: "Propietario creado" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ ok: false, e, msg: "Error en servidor" });
  }
};

const register = async (req = request, res = response) => {
  const { email, nombreUsuario, contrasena, nombre, apellido, dni, celular } = req.body;
  if (!email || !nombreUsuario || !contrasena || !nombre || !apellido || !dni) {
    return res.status(400).json({ ok: false, msg: "Datos insuficientes" });
  }
  
  try {
    // Valor aleatorio para generar hasheo
    const salt = 12;
    const hashContrasena = await bcrypt.hash(contrasena, salt);

    const connection = await getConnection();
    const [result] = await connection.execute(
      "INSERT INTO Usuario (email, nombreUsuario, contrasena) VALUES (?, ?, ?)",
      [email, nombreUsuario, hashContrasena]
    );

    const userId = result.insertId;

    // Insertar en tabla Cliente
    await connection.execute(
      "INSERT INTO Cliente (id, dni, nombre, apellido, celular) VALUES (?, ?, ?, ?, ?)",
      [userId, dni, nombre, apellido, celular]
    );
    
    res.status(201).json({ ok: true, result, msg: "approved" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ ok: false, e, msg: "Server error" });
  }
};

const login = async (req = request, res = response) => {
  const { nombreUsuario, password } = req.body;
  if (!nombreUsuario || !password) {
    return res.status(400).json({ ok: false, msg: "Datos insuficientes" });
  }
  try {
    const connection = await getConnection();
    const [result] = await connection.execute(
      "SELECT * FROM Usuario WHERE nombreUsuario = ?",
      [nombreUsuario]
    );

    if (result.length === 0) {
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }

    const user = result[0];
    const isPasswordValid = await bcrypt.compare(password, user.contrasena);

    if (!isPasswordValid) {
      return res.status(401).json({ ok: false, msg: "Contraseña incorrecta" });
    }

    const token = await generateJwt(user);
    res.status(200).json({ ok: true, token, msg: "Inicio de sesión exitoso" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, msg: "Error en servidor" });
  }
};

const getUser = async (req = request, res = response) => {
  console.log("Parámetros", req.params);
  const {id} = req.params.id;

  if (!id) return res.status(400).json({ ok: false, msg: "El parámetro no fue provisto" });

  try {
    const connection = await getConnection();
    const [result] = await connection.query(
      "SELECT * FROM Usuario WHERE id = ?",
      [id]
    );
    res.status(200).json({ ok: true, usuario: result[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error en servidor" });
  }
};

module.exports = { register, registerAdmin, registerOwner, login, getUser };