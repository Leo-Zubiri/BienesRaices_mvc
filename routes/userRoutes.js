import express from "express";
const router = express.Router();

router.get('/',function(req,res){
    res.send('Hola mundo desde Express');
});

export default router;