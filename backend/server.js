require("dotenv").config();
const express = require("express");
const cors = require("cors");
const conexion = require("./db"); // Importamos la conexión creada en db.js

const app = express();

// Middlewares globales
app.use(cors()); // Permitir peticiones desde el frontend
app.use(express.json()); // Habilitar la lectura de datos en formato JSON en el cuerpo (req.body)

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

// 1. Obtener todos los productos (READ)
app.get("/productos", (req, res) => {
  const sql = "SELECT * FROM productos";

  conexion.query(sql, (error, resultados) => {
    if (error) {
      console.error("Error al consultar:", error);
      return res.status(500).json({ mensaje: "Error al consultar los productos" });
    }
    // Retornamos el array de productos como JSON al cliente
    res.json(resultados);
  });
});

// 2. Crear un nuevo producto (CREATE)
app.post("/productos", (req, res) => {
  const { nombre, precio, stock } = req.body;

  // Consulta parametrizada con '?' para prevenir inyección SQL
  const sql = "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)";
  const valores = [nombre, precio, stock];

  conexion.query(sql, valores, (error, resultado) => {
    if (error) {
      console.error("Error al insertar:", error);
      return res.status(500).json({ mensaje: "Error al crear el producto" });
    }

    res.status(201).json({
      mensaje: "Producto creado correctamente",
      id: resultado.insertId,
    });
  });
});

// 3. Actualizar un producto existente (UPDATE)
app.put("/productos/:id", (req, res) => {
  const id = req.params.id;
  const { nombre, precio, stock } = req.body;

  const sql = "UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?";
  const valores = [nombre, precio, stock, id];

  conexion.query(sql, valores, (error, resultado) => {
    if (error) {
      console.error("Error al actualizar:", error);
      return res.status(500).json({ mensaje: "Error al actualizar el producto" });
    }
    res.json({ mensaje: "Producto actualizado correctamente" });
  });
});

// 4. Eliminar un producto (DELETE)
app.delete("/productos/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM productos WHERE id = ?";

  conexion.query(sql, [id], (error, resultado) => {
    if (error) {
      console.error("Error al eliminar:", error);
      return res.status(500).json({ mensaje: "Error al eliminar el producto" });
    }
    res.json({ mensaje: "Producto eliminado correctamente" });
  });
});

// ==========================================
// RUTAS DE CONTACTO
// ==========================================

// 5. Registrar un nuevo mensaje de contacto (POST)
app.post(["/contacto", "/enviar-mensaje"], (req, res) => {
  const { nombre, email, correo, asunto, mensaje } = req.body;
  const correoContacto = email ?? correo;

  // Validación básica de campos requeridos
  if (![nombre, correoContacto, asunto, mensaje].every(
    (campo) => typeof campo === "string" && campo.trim()
  )) {
    return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
  }

  const sql = "INSERT INTO contactos (nombre, correo, asunto, mensaje) VALUES (?, ?, ?, ?)";
  const valores = [nombre.trim(), correoContacto.trim(), asunto.trim(), mensaje.trim()];

  conexion.query(sql, valores, (error, resultado) => {
    if (error) {
      console.error("Error al guardar mensaje de contacto:", error);
      return res.status(500).json({ mensaje: "Error al registrar el mensaje de contacto" });
    }

    res.status(201).json({
      mensaje: "Mensaje de contacto enviado con éxito",
      id: resultado.insertId,
    });
  });
});

// 6. Consultar todos los mensajes de contacto (GET)
app.get(["/contacto", "/contactos"], (req, res) => {
  const sql = "SELECT * FROM contactos ORDER BY fecha DESC";

  conexion.query(sql, (error, resultados) => {
    if (error) {
      console.error("Error al consultar mensajes de contacto:", error);
      return res.status(500).json({ mensaje: "Error al consultar los mensajes de contacto" });
    }
    res.json(resultados);
  });
});

// 7. Actualizar un mensaje de contacto (UPDATE)
app.put(["/contacto/:id", "/contactos/:id"], (req, res) => {
  const { nombre, email, correo, asunto, mensaje } = req.body;
  const correoContacto = email ?? correo;

  if (![nombre, correoContacto, asunto, mensaje].every(
    (campo) => typeof campo === "string" && campo.trim()
  )) {
    return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
  }

  const sql = `
    UPDATE contactos
    SET nombre = ?, correo = ?, asunto = ?, mensaje = ?
    WHERE id = ?
  `;
  const valores = [
    nombre.trim(),
    correoContacto.trim(),
    asunto.trim(),
    mensaje.trim(),
    req.params.id,
  ];

  conexion.query(sql, valores, (error, resultado) => {
    if (error) {
      console.error("Error al actualizar mensaje de contacto:", error);
      return res.status(500).json({ mensaje: "Error al actualizar el mensaje de contacto" });
    }

    if (resultado.affectedRows > 0) {
      return res.json({ mensaje: "Mensaje actualizado correctamente" });
    }

    conexion.query(
      "SELECT id FROM contactos WHERE id = ?",
      [req.params.id],
      (errorConsulta, resultados) => {
        if (errorConsulta) {
          console.error("Error al verificar mensaje de contacto:", errorConsulta);
          return res.status(500).json({ mensaje: "Error al actualizar el mensaje de contacto" });
        }
        if (resultados.length === 0) {
          return res.status(404).json({ mensaje: "No se encontró el mensaje de contacto" });
        }
        res.json({ mensaje: "Mensaje actualizado correctamente" });
      }
    );
  });
});

// 8. Eliminar un mensaje de contacto (DELETE)
app.delete(["/contacto/:id", "/contactos/:id"], (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM contactos WHERE id = ?";

  conexion.query(sql, [id], (error, resultado) => {
    if (error) {
      console.error("Error al eliminar mensaje de contacto:", error);
      return res.status(500).json({ mensaje: "Error al eliminar el mensaje de contacto" });
    }
    res.json({ mensaje: "Mensaje eliminado correctamente" });
  });
});

// Iniciar servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});