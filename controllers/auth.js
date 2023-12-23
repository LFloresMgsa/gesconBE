const db = require("../database/db.js");
const JWT = require("jsonwebtoken")
const md5 = require("md5");




function getValidacion(Accion, user, password) {
    // create mysql connection
    const connection = db.getConnection();

    return new Promise((resolve, reject) => {
        connection.query("CALL sp_sgm_usuarios (?,?,?,?,?) ", [Accion, user, "", password, ""],
            function (error, results, fields) {

                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
    });
}



// LOGIN
const token = async (request, response) => {
    try {
        const { Sgm_cUsuario, Sgm_cContrasena } = request.body;

        // debe consultar a la bd el usuario y contrasseña
        // si se encontro debe generar el jwt sino return

        const _result = await getValidacion("BUSCARREGISTRO", Sgm_cUsuario, md5(Sgm_cContrasena));

        if (!_result) {
            return response.status(422).json({
                errors: [
                    {
                        msg: "This user already not exists",
                    }
                ]
            })
        }


        const token = JWT.sign({ Sgm_cUsuario }, "nfb32iur32ibfqfvi3vf932bg932g932", { expiresIn: 360000 });


       // console.log(token);
        
        response.json({
            token
        });

    } catch (error) {
        response.status(500);
        response.send(error.message);
    }
};




// export functions
module.exports = {
    token
};

