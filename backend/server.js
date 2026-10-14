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

/* =========================================================
   RUTAS DE PRODUCTOS (CRUD)
   ========================================================= */

// 1. Obtener todos los productos (READ)
app.get("/productos", (req, res) => {
  const sql = "SELECT * FROM productos ORDER BY id DESC";

  conexion.query(sql, (error, resultados) => {
    if (error) {
      console.error("Error al consultar productos:", error);
      return res.status(500).json({ mensaje: "Error al consultar los productos" });
    }
    res.json(resultados);
  });
});

// 2. Crear un nuevo producto (CREATE)
app.post("/productos", (req, res) => {
  const { nombre, precio, stock } = req.body;

  const sql = "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)";
  const valores = [nombre, precio, stock];

  conexion.query(sql, valores, (error, resultado) => {
    if (error) {
      console.error("Error al insertar producto:", error);
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
      console.error("Error al actualizar producto:", error);
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
      console.error("Error al eliminar producto:", error);
      return res.status(500).json({ mensaje: "Error al eliminar el producto" });
    }
    res.json({ mensaje: "Producto eliminado correctamente" });
  });
});

/* =========================================================
   RUTAS DE CONTACTOS (CRUD)
   ========================================================= */

// 1. Obtener todos los mensajes de contacto (READ)
app.get("/contactos", (req, res) => {
  const sql = "SELECT * FROM contactos ORDER BY fecha DESC";

  conexion.query(sql, (error, resultados) => {
    if (error) {
      console.error("Error al consultar contactos:", error);
      return res.status(500).json({ mensaje: "Error al obtener los contactos" });
    }
    res.json(resultados);
  });
});

// 2. Crear mensaje de contacto (CREATE)
app.post("/enviar-mensaje", (req, res) => {
  const { nombre, correo, asunto, mensaje } = req.body;

  if (!nombre || !correo || !asunto || !mensaje) {
    return res.status(400).json({
      exito: false,
      mensaje: "Todos los campos son obligatorios",
    });
  }

  const sql = "INSERT INTO contactos (nombre, correo, asunto, mensaje) VALUES (?, ?, ?, ?)";
  const valores = [nombre, correo, asunto, mensaje];

  conexion.query(sql, valores, (error, resultado) => {
    if (error) {
      console.error("Error al insertar contacto:", error);
      return res.status(500).json({
        exito: false,
        mensaje: "Error al guardar el mensaje en la base de datos",
      });
    }

    res.status(201).json({
      exito: true,
      mensaje: "Mensaje guardado correctamente",
      id: resultado.insertId,
    });
  });
});

// 3. Actualizar mensaje de contacto (UPDATE)
app.put("/contactos/:id", (req, res) => {
  const id = req.params.id;
  const { nombre, correo, asunto, mensaje } = req.body;

  if (!nombre || !correo || !asunto || !mensaje) {
    return res.status(400).json({
      exito: false,
      mensaje: "Todos los campos son obligatorios",
    });
  }

  const sql = "UPDATE contactos SET nombre = ?, correo = ?, asunto = ?, mensaje = ? WHERE id = ?";
  const valores = [nombre, correo, asunto, mensaje, id];

  conexion.query(sql, valores, (error, resultado) => {
    if (error) {
      console.error("Error al actualizar contacto:", error);
      return res.status(500).json({ exito: false, mensaje: "Error al actualizar el mensaje" });
    }
    res.json({ exito: true, mensaje: "Mensaje actualizado correctamente" });
  });
});

// 4. Eliminar mensaje de contacto (DELETE)
app.delete("/contactos/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM contactos WHERE id = ?";

  conexion.query(sql, [id], (error, resultado) => {
    if (error) {
      console.error("Error al eliminar contacto:", error);
      return res.status(500).json({ exito: false, mensaje: "Error al eliminar el mensaje" });
    }
    res.json({ exito: true, mensaje: "Mensaje eliminado correctamente" });
  });
});

// Iniciar servidor en el puerto 3000
app.listen(3000, () => {
  console.log("Servidor ejecutándose en http://localhost:3000");
});