/**
 * @description Los controladores manejan la lógica de nuestra aplicación.
 * @description Function register registra usuario y dependiendo el rol lo agrega a la tabla correspondiente.
 * @description Function login inicio de sesión
 * @description Function getUser obtiene un usuario en específico
 */

const { request, response } = require("express");
const { getConnection } = require("../database/database");
const bcrypt = require("bcrypt");
const { generateJwt } = require("../middlewares/jwt");

const register = async (req = request, res = response) => {
  const { username, password, email, rol = "cliente", nombre, apellido, celular, dni, cuil } = req.body;

  if (!username || !password || !email || !nombre || !apellido || !celular) {
    return res.status(400).json({ ok: false, msg: "Todos los campos son obligatorios" });
  }

  try {
    // Hasheo de password con valor aleatorio
    const salt = 12;
    const hashedPassword = await bcrypt.hash(password, salt);

    const connection = await getConnection();
    // Indica que las operaciones siguientes son parte de transacción (las modificaciones a la BD quedan en espera no, se generan inmediatemente)
    await connection.beginTransaction();

    // Registrar en tabla usuario
    const [userResult] = await connection.query(
      "INSERT INTO Usuario (usuario, email, contrasenia, rol, nombre, apellido, celular) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [username, email, hashedPassword, rol, nombre, apellido, celular]
    );
    const userId = userResult.insertId;

    // Registra datos específicos según el rol
    if (rol === "cliente") {
      if (!dni) {
        return res.status(400).json({ ok: false, msg: "El DNI es obligatorio para clientes" });
      }
      await connection.query(
        "INSERT INTO Cliente (id_usuario, dni) VALUES (?, ?)",
        [userId, dni]
      );
    } else if (rol === "propietario") {
      if (!cuil) {
        return res.status(400).json({ ok: false, msg: "El CUIL es obligatorio para propietarios" });
      }
      await connection.query(
        "INSERT INTO Propietario (id_usuario, cuil) VALUES (?, ?)",
        [userId, cuil]
      );
    }
    // La transacción no se confirma hasta covmmit.
    await connection.commit();
    res.status(201).json({ ok: true, msg: "Usuario registrado", id: userId });
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
    const [result] = await connection.query("SELECT * FROM Usuario WHERE usuario = ?", [username]);

    if (!result.length) {
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }

    const user = result[0];
    const isPasswordValid = await bcrypt.compare(password, user.contrasenia);

    if (!isPasswordValid) {
      return res.status(401).json({ ok: false, msg: "Contraseña incorrecta" });
    }

    const token = await generateJwt({
      sub: user.id,
      username: user.usuario,
      rol: user.rol,
    });

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
    const [result] = await connection.query("SELECT * FROM Usuario WHERE id = ?", [id]);

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
