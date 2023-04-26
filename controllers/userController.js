import {check, validationResult} from 'express-validator'
import { generarID } from '../helpers/tokens.js';
import { emailRegister } from '../helpers/emails.js';

import Usuario from "../models/Usuario.js";

const formularioLogin = (req,res)=>{
    res.render('auth/login',{
        pagina: 'Iniciar Sesión'
    });
}

const formularioRegistro = (req,res)=>{
    res.render('auth/register',{
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    });
}

const formularioOlvidePassword = (req,res)=>{
    res.render('auth/forgot-password',{
        pagina: 'Recupera el Acceso a tu Cuenta',
        csrfToken: req.csrfToken()
    });
}

const resetPassword = async (req,res) => { 
    // Validation
    await check('email').isEmail().withMessage('No es un email válido').run(req)

    let errores = validationResult(req)

    // Verificar que no existan errores
    if(!errores.isEmpty()){
        return res.render('auth/forgot-password',{
            pagina: 'Recupera el acceso a tu cuenta',
            csrfToken: req.csrfToken(),
            errores: errores.array(),
        });
    }


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
        return res.render('auth/register',{
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
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
        return res.render('auth/register',{
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
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

        // Enviar correo de confirmación
        emailRegister({
            name: usuario.name,
            email: usuario.email,
            token: usuario.token
        })
        

        // Mostrar mensaje para que confirme el correo
        res.render('templates/mensaje',{
            pagina: 'Cuenta creada correctamente',
            mensaje: 'Se envió un email de confirmación para dar de alta tu cuenta'
        });
    }
    

}

const confirmar = async (req,res) => {
    const {token} = req.params;
    
    const usuario = await Usuario.findOne({ where: {token} });
    
    // Verificar si el token es válido
    if(!usuario){
        return res.render('auth/confirm-account',{
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            error: true
        });
    }

    // Confirmar la cuenta
    usuario.token = null;
    usuario.confirmed = true;

    await usuario.save();

    res.render('auth/confirm-account',{
        pagina: 'Cuenta confirmada',
        mensaje: 'La cuenta se confirmó correctamente',
    });

}

export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar,
    confirmar,
    resetPassword
}