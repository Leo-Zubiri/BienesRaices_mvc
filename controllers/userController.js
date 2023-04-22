import {check, validationResult} from 'express-validator'
import { generarID } from '../helpers/tokens.js';

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
    await check('name').notEmpty().withMessage('Nombre no puede ir vacío').run(req)
    await check('email').isEmail().withMessage('No es un email válido').run(req)
    await check('password').isLength({min: 6}).withMessage('Password debe de ser de al menos 6 caracteres').run(req)
    await check('password_confirmation').equals(req.body.password).withMessage('Los Passwords no coinciden').run(req)

    let errores = validationResult(req)

    // Verificar que no existan errores
    if(!errores.isEmpty()){
        res.render('auth/register',{
            pagina: 'Crear Cuenta',
            errores: errores.array(),
            usuario: {
                name: req.body.name,
                email: req.body.email
            }
        });
    }
    
    // Verificar que no exista un usuario con el mismo correo
    const existeUsuario = await Usuario.findOne({ where: {email:req.body.email}})
    if(existeUsuario){
        res.render('auth/register',{
            pagina: 'Crear Cuenta',
            errores: [{msg: 'Existe un usuario con este correo'}],
            usuario: {
                name: req.body.name,
                email: req.body.email
            }
        });
       
    } else {
        const {name,email,password} = req.body;
        const usuario = await Usuario.create({
            name,email,password,
            token: generarID()
        });
        res.json(usuario)
    }
    

}

export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar
}