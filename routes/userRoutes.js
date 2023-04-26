import express from "express";
import { 
    formularioLogin,
    formularioRegistro, 
    formularioOlvidePassword,
    registrar,
    confirmar,
    resetPassword
} from "../controllers/userController.js";

const router = express.Router();

router.get('/login',formularioLogin);
router.get('/register',formularioRegistro); 

router.get('/forgot-password',formularioOlvidePassword); 
router.post('/forgot-password',resetPassword); 

router.post('/register',registrar); 
router.get('/confirm/:token',confirmar);

export default router;