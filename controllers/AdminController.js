"use strict";

const Admin = require("../models/admin");
const bcrypt = require("bcrypt-nodejs");
const jwt = require('../helpers/jwt');


/**
 *  metodo que permite realizar el registro de un nuevo cliente
 * @param {*} req, datos que llegan del formulario de registro
 * @param {*} res
 */

const registro_admin = async function (req, res) {
  var data = req.body;

  var admin_arr = [];

  admin_arr = await Admin.find({ email: data.email });

  if (admin_arr.length == 0) {
    if (data.password) {
      bcrypt.hash(data.password, null, null, async function (err, hash) {
        if (hash) {
          data.password = hash;
          var reg = await Admin.create(data);

        
          res.status(200).send({
            message: "El administrador ha registrado con exito",
            data: reg,
          });
        } else {
            res.status(404).send({
                message: "Error Server",
                data: undefined,
              });

        }
      });
    } else {
      res.status(500).send({
        message: "No hay ninguna contraseña",
        data: undefined,
      });
    }
  } else {
    res.status(500).send({
      message: "El correo ya esta siendo usado por otro administrador",
    });
  }
};


const admin_login = async function (req, res) {
  var data = req.body;

  var admin_arr = [];

  admin_arr = await Admin.find({ email: data.email });

  if (admin_arr.length == 0) {
    //No existe el usuario

    res.status(500).send({
      message: "No se encontro el administrador",
      data: undefined,
    });
  } else {
    let user = admin_arr[0];

   
    bcrypt.compare(data.password, user.password, async function (error, check) {
      if (check) {

        var token = jwt.createToken(user)
        user.password = undefined;
        res.status(200).send({
          message: "Usuario logeado",
          data: user,
          token: token
        });
      } else {
        res.status(200).send({
          message: "la Contraseña no coincide",
          data: undefined,
        });
      }
    });
  }


};

module.exports = {
    registro_admin,
    admin_login,
};