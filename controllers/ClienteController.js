"use strict";
const validator = require("validator");
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

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const registerClientAdmin = async function (req, res) {
  if (req.user) {
    if (req.user.rol == "admin") {
      var clientes_arr = [];

      clientes_arr = await Cliente.find({ email: req.body.email });

      if (clientes_arr.length == 0) {
        bcrypt.hash("admin1234567", null, null, async function (err, hash) {
          if (hash) {
            var data = req.body;
            data.password = hash;
            console.log(data);
            var reg = await Cliente.create(data);

            return res.status(200).send({
              status: "Success",
              message: "Se registro exitosamente el cliente",
            });
          }
        });
      } else {
        return res.status(404).send({
          status: "Error",
          message: "Ya existe un Cliente con ese mismo correo ",
        });
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

const getClient = async function (req, res) {
  if (req.user) {
    if (req.user.rol == "admin") {
      var userId = req.params.id;

      Cliente.findById(userId).exec((err, user) => {
        if (err) {
          return res.status(404).send({
            status: "Error",
            message: "Se presento un error al consultar del cliente",
          });
        } else if (!user) {
          return res.status(404).send({
            status: "Error",
            message: "No existe el cliente",
          });
        } else {
          return res.status(200).send({
            status: "success",
            client: user,
          });
        }
      });
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

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const updateClient = async function (req, res) {
  console.log(req.params.id);

  if (req.user) {
    if (req.user.rol == "admin") {
      var params = req.body;

      // validar datos

      try {
        var nombres = !validator.isEmpty(params.nombres);
        var apellidos = !validator.isEmpty(params.apellidos);
        var email =
          !validator.isEmpty(params.email) && validator.isEmail(params.email);
        var telefono = !validator.isEmpty(params.telefono);
      } catch (err) {
        return res.status(400).send({
          message: "Faltan datos por enviar",
          params,
        });
      }

      // Eliminar propiedades innecesarias

      delete params.password;
      // Buscar y Actualizar documento

      var userId = req.params.id;

      Cliente.findOne({ email: params.email }, (err, issetUser) => {
        if (err) {
          return res.status(500).send({
            message: "Error al actualizar el correo",
          });
        }

        if (issetUser._id == req.params.id) {
          Cliente.findOneAndUpdate(
            { _id: userId },
            params,
            { new: true },
            (err, userUpdated) => {
              if (err) {
                return res.status(500).send({
                  message: "Error al actualizar",
                });
              }
              if (!userUpdated) {
                return res.status(200).send({
                  status: "Error",
                  message: "No se ha actualizado el cliente",
                  error: err,
                });
              }

              return res.status(200).send({
                status: "Success",
                message: " Se ha actualizado correctamente el cliente ",
                user: userUpdated,
              });
            }
          );

          // 7. Devolver respuesta
        } else {
          return res.status(500).send({
            message: "Email ya se encuentra registrado con otro cliente",
          });
        }
      });
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

const deleteCliente = function (req, res) {
  // Sacar el id del topic de la Url

  var id = req.params.id;

  // Find and delete por topicId y por userId

  Cliente.findOneAndDelete({ _id: id }, (err, deleteClient) => {
    if (err) {
      return res.status(404).send({
        status: "error",
        message: "Se ha presentando un error en la petición",
        err: err,
      });
    } else if (!deleteClient) {
      return res.status(404).send({
        status: "error",
        message: "No se a logrado eliminar el dato",
        err: err,
      });
    } else {
      return res.status(200).send({
        status: "success",
        message: "Se ha eliminado correctamente el dato",
        cliente: deleteClient,
      });
    }
  });
};

module.exports = {
  registro_cliente,
  login_cliente,
  filter_client,
  registerClientAdmin,
  getClient,
  updateClient,
  deleteCliente,
};
