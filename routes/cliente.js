"use strict";

const express = require("express");
const clienteController = require("../controllers/ClienteController");
var authenticate = require('../middlewares/authenticate');

const api = express.Router();

api.post("/registro_cliente", clienteController.registro_cliente);
api.post("/login_cliente", clienteController.login_cliente);
api.post("/registerClienteAdmin",authenticate.auth, clienteController.registerClientAdmin);

api.put("/updatecliente/:id",authenticate.auth,clienteController.updateClient);
api.delete("/deleteCliente/:id",authenticate.auth,clienteController.deleteCliente);
api.get("/getClient/:id",authenticate.auth,clienteController.getClient);
api.get("/filter_client/:tipo?/:filtro",authenticate.auth, clienteController.filter_client);

module.exports = api;
