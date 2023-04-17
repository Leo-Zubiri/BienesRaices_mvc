import express from "express";
import { 
    formularioLogin,
    formularioRegistro, 
    formularioOlvidePassword,
    registrar
} from "../controllers/userController.js";

const router = express.Router();

router.get('/login',formularioLogin);
router.get('/register',formularioRegistro); 
router.get('/forgot-password',formularioOlvidePassword); 

router.post('/register',registrar); 

export default router;