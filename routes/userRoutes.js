import express from "express";
import { 
    formularioLogin,
    formularioRegistro, 
    formularioOlvidePassword,
    registrar,
    confirmar,
    resetPassword,
    comprobarToken,
    nuevoPassword,
    autenticar
} from "../controllers/userController.js";

const router = express.Router();

router.get('/login',formularioLogin);
router.post('/login',autenticar);
router.get('/register',formularioRegistro); 

router.get('/forgot-password',formularioOlvidePassword); 
router.post('/forgot-password',resetPassword); 

router.post('/register',registrar); 
router.get('/confirm/:token',confirmar);

// Almacenar nuevo password
router.get('/forgot-password/:token', comprobarToken);
router.post('/forgot-password/:token', nuevoPassword);


export default router;