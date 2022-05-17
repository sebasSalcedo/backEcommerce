"use strict";

const express = require("express");
const clienteController = require("../controllers/ClienteController");
var authenticate = require('../middlewares/authenticate');

const api = express.Router();

api.post("/registro_cliente", clienteController.registro_cliente);
api.post("/login_cliente", clienteController.login_cliente);

api.get("/filter_client/:tipo?/:filtro",authenticate.auth, clienteController.filter_client);

module.exports = api;
