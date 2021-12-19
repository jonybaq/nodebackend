const express= require('express');
const {dbConnection} = require('./database/config');
require('dotenv').config();
var cors = require('cors')
//crear servidor express

const app=express();

//base de datos
dbConnection();
//Habilita cors
app.use(cors())
// necesario para obtener el json de todas las peticiones
//libreria bodyparse tambien hace eso
app.use(express.json());
//app.use(bodyParser.urlencoded({ extended: true }));
//escuchar peticiones
app.use('/api/auth',require('./routes/auth'));
app.use('/api/events',require('./routes/events'));
//statics
app.use(express.static("public"));

app.listen(process.env.PORT,()=>{
    console.log(`Start=>`, `Servidor corriendo en el puerto ${process.env.PORT}`);
});