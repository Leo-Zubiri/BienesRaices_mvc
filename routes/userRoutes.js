import express from "express";
import { 
    formularioLogin,
    formularioRegistro, 
    formularioOlvidePassword,
    registrar,
    confirmar,
    resetPassword,
    comprobarToken,
    nuevoPassword
} from "../controllers/userController.js";

const router = express.Router();

router.get('/login',formularioLogin);
router.get('/register',formularioRegistro); 

router.get('/forgot-password',formularioOlvidePassword); 
router.post('/forgot-password',resetPassword); 

router.post('/register',registrar); 
router.get('/confirm/:token',confirmar);

// Almacenar nuevo password
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);


export default router;