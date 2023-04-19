import {check, validationResult} from 'express-validator'

import Usuario from "../models/Usuario.js";

const formularioLogin = (req,res)=>{
    res.render('auth/login',{
        pagina: 'Iniciar Sesión'
    });
}

const formularioRegistro = (req,res)=>{
    res.render('auth/register',{
        pagina: 'Crear Cuenta'
    });
}

const formularioOlvidePassword = (req,res)=>{
    res.render('auth/forgot-password',{
        pagina: 'Recupera el Acceso a tu Cuenta'
    });
}

const registrar = async (req,res) => { 
    // Validation
    await check('name').notEmpty.withMessage('Nombre no puede ir vacío').run(req)

    let resultado = validationResult(req)

    const usuario = await Usuario.create(req.body);

    res.json(usuario)
}

export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar
}