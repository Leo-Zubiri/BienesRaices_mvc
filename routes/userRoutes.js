import express from "express";
const router = express.Router();

router.get('/login',function(req,res){
    res.render('auth/login',{
        autenticado: true,
        user: 'Leo Zubiri'
    });
});

export default router;