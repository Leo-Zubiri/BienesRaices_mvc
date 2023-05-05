import {check, validationResult} from 'express-validator'
import bcrypt from 'bcrypt'
import { generarID,generarJWT } from '../helpers/tokens.js';
import { emailRegister,
        emailForgottenPassword
 } from '../helpers/emails.js';

import Usuario from "../models/Usuario.js";

const formularioLogin = (req,res)=>{
    res.render('auth/login',{
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken()
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

    // Buscar el usuario en base a email
    const {email} = req.body;

    const usuario = await Usuario.findOne({where: { email }})
    console.log(usuario)

    if(!usuario){
        return res.render('auth/forgot-password',{
            pagina: 'Recupera el acceso a tu cuenta',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'No existe una cuenta enlazada a este correo'}],
        });
    }

    // Generar un token y enviar email
    usuario.token = generarID();
    await usuario.save();

    // Enviar un email
    emailForgottenPassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })

    // Reenderizar mensaje
    res.render('templates/mensaje',{
        pagina: 'Reestablece tu password',
        mensaje: 'Se envió un email para el cambio del password'
    });
}

const comprobarToken = async (req,res) => { 
    const {token} = req.params; // Token en URL
    const usuario = await Usuario.findOne({where: {token}})

    if(!usuario){
        return res.render('auth/confirm-account',{
            pagina: 'Reestablece tu password',
            mensaje: 'Hubo un error al validar tu información, intenta de nuevo',
            error: true
        });
    }

    // Mostrar formulario para modificar el nuevo password
    return res.render('auth/reset-password',{
        pagina: 'Reestablece tu password',
        csrfToken: req.csrfToken()
    });
}

const nuevoPassword = async (req,res) => { 
    await check('password').isLength({min: 6}).withMessage('Password debe de ser de al menos 6 caracteres').run(req)

    let errores = validationResult(req)

    // Verificar que no existan errores
    if(!errores.isEmpty()){
        return res.render('auth/reset-password',{
            pagina: 'Reestablece tu Password',
            csrfToken: req.csrfToken(),
            errores: errores.array(),
        });
    }

    const {token} = req.params;
    const {password} = req.body;

    // Identificar quien hace el cambio
    const usuario = await Usuario.findOne({where:{token}});

    // Hash password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password,salt);
    usuario.token = null;

    await usuario.save();

    res.render('auth/confirm-account',{
        pagina: 'Password Reestablecido',
        mensaje: 'El password se guardó correctamente', 
        csrfToken: req.csrfToken()
    })
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

const autenticar = async (req,res) => { 
    
    // Validar campos que llegan del request
    await check('email').isEmail().withMessage('No es un email válido').run(req)
    await check('password').notEmpty().withMessage('Password es obligatorio').run(req)

    let errores = validationResult(req)
    
    // Verificar que no existan errores
    if(!errores.isEmpty()){
        return res.render('auth/login',{
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: errores.array(),
        });
    }

    // Comprobar si el usuario existe
    const {email,password} = req.body;

    const usuario = await Usuario.findOne({where:{email}})
    if(!usuario){
        return res.render('auth/login',{
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario no existe'}],
        });
    }

    // Comprobar si el usuario está verificado
    if(!usuario.confirmed){
        return res.render('auth/login',{
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Cuenta no verificada'}],
        });
    }

    // Revisar password
    if(!usuario.verifyPassword(password)){
        return res.render('auth/login',{
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Password Incorrecto'}],
        });
    }

    // Autenticar Usuario
    const token = generarJWT(usuario.id);
    console.log(token)

    // Almacenar en un cookie
    return res.cookie('_token',{
        httpOnly: true,
        // sameSite: true,
        // secure: true  // ssl certificacion
    }).redirect('/mis-propiedades')
}

export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar,
    confirmar,
    resetPassword,
    comprobarToken,
    nuevoPassword,
    autenticar
}