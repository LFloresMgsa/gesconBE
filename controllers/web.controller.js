/*-------------------------------------------------
Componente: Procedimientos No Transaccionales
-------------------------------------------------*/
const mysql = require("mysql");
const sc = require("../database/StringConection");
//const util = require('util');


const db = require("../database/db.js");

const ouUsuario = require("../models/sgm_usuarios.js");

//get all data api with store procedure

const getUsuario = async (request, response) => {
    let connection;
    try {
        // create mysql connection
        connection = await mysql.createConnection(sc.dbStringConection());

        var params = request.body;
        ouUsuario.Accion = params.Accion;
        ouUsuario.Sgm_cUsuario = params.Sgm_cUsuario;
        ouUsuario.Sgm_cNombre = params.Sgm_cNombre;
        ouUsuario.Sgm_cContrasena = params.Sgm_cContrasena;
        ouUsuario.Sgm_cObservaciones = params.Sgm_cObservaciones;

        connection.query("CALL sp_sgm_usuarios (?,?,?,?,?) ", [
            ouUsuario.Accion, ouUsuario.Sgm_cUsuario, ouUsuario.Sgm_cNombre,
            ouUsuario.Sgm_cContrasena, ouUsuario.Sgm_cObservaciones
        ], function (error, results, fields) {

            if (error) {

                response.json({ error: error.message });

            } else {
                response.json(results);
            }
        });
    } catch (error) {
        response.status(500);
        response.send(error.message);
    } finally {
        if (connection) {
            connection.end();
        }
    }
};

// export functions
module.exports = {
    getUsuario,
};


