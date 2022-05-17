'use strict'

const express = require('express');
const adminController = require('../controllers/AdminController');

const api = express.Router();


api.post('/registro_admin',adminController.registro_admin)
api.post('/admin_login',adminController.admin_login)





module.exports = api;