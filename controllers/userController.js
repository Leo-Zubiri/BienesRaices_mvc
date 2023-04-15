const formularioLogin = (req,res)=>{
    res.render('auth/login',{
        autenticado: true,
        user: 'Leo Zubiri'
    });
}

const formularioRegistro = (req,res)=>{
    res.render('auth/register',{});
}

export {
    formularioLogin,
    formularioRegistro
}