'use strict'

const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

var port = process.env.PORT || 4201;

//RUTAS

const cliente_ruote = require('./routes/cliente');
const admin_ruote   = require('./routes/admin');



// Servidor

mongoose.connect( 'mongodb://127.0.0.1:27017/tienda', { useUnifiedTopology: true, useNewUrlParser:true } , ( err, res ) => {

    if (err) {
        console.log(err);
    } else {
        console.log("server RUNNING");
        app.listen(port,function () {
            console.log("server RUNNING in the PORT: "+ port);

        });
    }

})



app.use(bodyparser.urlencoded({

    extended:true

}));

app.use(bodyparser.json({limit:'50mb',extended:true}))


//CORS

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); 
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();
});


//Routes use

app.use('/api',cliente_ruote);
app.use('/api',admin_ruote);






module.exports = app;