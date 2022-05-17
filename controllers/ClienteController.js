"use strict";

const Cliente = require("../models/cliente");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../helpers/jwt");

/**
 *  metodo que permite realizar el registro de un nuevo cliente
 * @param {*} req, datos que llegan del formulario de registro
 * @param {*} res
 */

const registro_cliente = async function (req, res) {
  var data = req.body;

  var clientes_arr = [];

  clientes_arr = await Cliente.find({ email: data.email });

  if (clientes_arr.length == 0) {
    if (data.password) {
      bcrypt.hash(data.password, null, null, async function (err, hash) {
        if (hash) {
          data.password = hash;
          var reg = await Cliente.create(data);

          res.status(200).send({
            message: "Cliente registrado con exito",
            data: data,
          });
        } else {
          res.status(404).send({
            message: "Error Serve",
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
      message: "El correo ya esta siendo usado por otro Cliente",
    });
  }
};

/**
 * Metodo que permite realizar el login del cliente
 * @param {email, password} req, datos que llegan del formulario de login
 * @param {*} res
 */

const login_cliente = async function (req, res) {
  var data = req.body;

  var cliente_arr = [];

  cliente_arr = await Cliente.find({ email: data.email });

  if (cliente_arr.length == 0) {
    //No existe el usuario

    res.status(500).send({
      message: "No se encontro el usuario",
      data: undefined,
    });
  } else {
    let user = cliente_arr[0];

    bcrypt.compare(data.password, user.password, async function (error, check) {
      if (check) {
        var token = jwt.createToken(user);

        res.status(200).send({
          message: "Usuario logeado",
          data: user,
          token: token,
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

/**
 * Metodo que permite listar y filtrar a los clientes
 * @param {*} req
 * @param {*} res
 */
const filter_client = async function (req, res) {

  if (req.user) {
    if (req.user.rol == "admin") {
      let tipo = req.params["tipo"];
      let filtro = req.params["filtro"];

      if (tipo == null || tipo == "null") {
        let reg = await Cliente.find().exec((err, client) => {
          if (err) {
            return res.status(404).send({
              status: "Error",
              message: "Se presento un error al consultar los clientes",
            });
          } else if (!client) {
            return res.status(200).send({
              status: "Error",
              message: "No hay usuario que mostrar",
            });
          } else {
            return res.status(200).send({
              status: "success",
              message: "Listado de clientes",

              client: client,
            });
          }
        });
      } else {
        //Realizar el filtro

        if (tipo == "apellidos") {
          let reg = await Cliente.find({
            apellidos: new RegExp(filtro, "i"),
          }).exec((err, cliente) => {
            if (err) {
              return res.status(404).send({
                status: "Error",
                message: "Se presento un error al filtrar los clientes",
              });
            } else if (!cliente) {
              return res.status(200).send({
                status: "Error",
                message: "No existe ese apellido",
              });
            } else {
              return res.status(200).send({
                status: "success",
                message: "Filtro de clientes",

                cliente: cliente,
              });
            }
          });
        } else if (tipo == "email") {
          let reg = await Cliente.find({
            email: new RegExp(filtro, "i"),
          }).exec((err, cliente) => {
            if (err) {
              return res.status(404).send({
                status: "Error",
                message: "Se presento un error al filtrar los clientes",
              });
            } else if (!cliente) {
              return res.status(200).send({
                status: "success",
                message: "No existe ese correo",
              });
            } else {
              return res.status(200).send({
                status: "success",
                message: "Filtro de clientes por correo",

                cliente: cliente,
              });
            }
          });
        }
      }
    } else {
      return res.status(500).send({
        status: "Error",
        message: "No tienes acceso",
      });
    }
  } else {
    return res.status(500).send({
      status: "Error",
      message: "No tienes acceso",
    });
  }
};

module.exports = {
  registro_cliente,
  login_cliente,
  filter_client,
};
