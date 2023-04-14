const express = require('express');

// Crear la app
const app = express();

// Routing
app.get('/',function(req,res){
    res.send('Hola mundo desde Express');
});

// Definir puerto
const port = 3000;

app.listen(port,() => { 
    console.log(`Servidor funcionando en el puerto ${port}`);
});