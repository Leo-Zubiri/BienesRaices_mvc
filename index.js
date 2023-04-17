
import express from 'express';
import userRoutes from './routes/userRoutes.js'
import db from './config/db.js'

// Crear la app
const app = express();

// Habilitar lectura de datos de formularios
app.use(express.urlencoded({extended: true}));

// DB Connection
try {
    await db.authenticate();
    db.sync();
    console.log('\nConexión correcta a la base de datos')
} catch (error) {
    console.log(error)
}

// Routing
app.use('/auth',userRoutes);

// Habilitar Pug
app.set('view engine','pug')
app.set('views','./views')

// Carpeta Pública
app.use(express.static('public'));

// Definir puerto
const port = 3000;

app.listen(port,() => { 
    console.log(`Servidor funcionando en el puerto ${port}`);
});