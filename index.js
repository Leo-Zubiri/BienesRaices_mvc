
import express from 'express';
import userRoutes from './routes/userRoutes.js'

// Crear la app
const app = express();

// Routing
app.use('/',userRoutes);

// Definir puerto
const port = 3000;

app.listen(port,() => { 
    console.log(`Servidor funcionando en el puerto ${port}`);
});