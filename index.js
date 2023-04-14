
import express from 'express';
import userRoutes from './routes/userRoutes.js'

// Crear la app
const app = express();

// Routing
app.use('/auth',userRoutes);

// Habilitar Pug
app.set('view engine','pug')
app.set('views','./views')

// Definir puerto
const port = 3000;

app.listen(port,() => { 
    console.log(`Servidor funcionando en el puerto ${port}`);
});