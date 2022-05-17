'use strict'

const jwt    = require('jwt-simple');
const moment = require('moment');

const secretKey = 'BZRkzB7uZUBscG%cjsn!h6Tt@4$7'



exports.createToken = function (user) {

    var payload = {

        sub:        user._id,
        nombres:    user.nombres,
        apellidos:  user.apellidos,
        email :     user.email,
        rol:        user.rol,
        iat:        moment().unix(),
        exp:        moment().add(7,'days').unix(),

    }

    return jwt.encode(payload,secretKey);

    
}