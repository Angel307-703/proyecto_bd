const mysql = require("mysql2");

// Configuración de la conexión a MySql
const conexion = mysql.createConnection({
host: "localhost",       // Servidor local
user: "root",           // Usuario de MySQL (Por defecto en XAMPP)
database: "tienda"     // Nombre de nuestra BD
});

// Comprobar si la conexión fue exitosa

conexion.connect((error) =>{
    if (error) {
        console.error("Error al conectar con MYSQL:", error);
        return;
    }
    console.log("Conexión exitosa con MYSQL");
});
// Exportar la conexión para poder usarla en otros archivos
module.exports = conexion;