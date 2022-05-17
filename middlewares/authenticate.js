"use strict";

const jwt = require("jwt-simple");
const moment = require("moment");

const secretKey = "BZRkzB7uZUBscG%cjsn!h6Tt@4$7";

exports.auth = function (req, res, next) {
  var authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(403).send({ message: "NoHeadersError" });
  } else {
    var token = req.headers.authorization.replace(/['"]+/g, "");
    var segment = token.split(".");

    if (segment.length != 3) {
      return res.status(403).send({ message: "Token no valido." });
    } else {
      try {
        var payload = jwt.decode(token, secretKey);

        if (payload.exp <= moment().unix()) {
          return res.status(403).send({ message: "Token expirado" });
        } else {
        
         req.user = payload;
          next();
        }
      } catch (error) {
        return res.status(403).send({ message: "Token no valido." });
      }
    }
  }

 

};
