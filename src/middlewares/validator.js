const { check } = require("express-validator");

const validateRegister = [
  check("email", "El email es obligatorio y debe ser válido").isEmail(),
  check("nombreUsuario", "El nombre de usuario es obligatorio").notEmpty(),
  check("contrasena", "La contraseña debe tener al menos 6 caracteres").isLength({ min: 6 }),
  check("rol", "El rol es obligatorio").notEmpty(),
];
