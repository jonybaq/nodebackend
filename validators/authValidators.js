const { check,validationResult } = require('express-validator');
const {response}= require('express');
const jwt  = require('jsonwebtoken');
//middleware
const hasErrors=(req,res=response,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ ok:false, msg: errors.array() });
    }
    next();
}
//validator-token
const validarToken=(req,res=response,next)=>{
    //valida el token
    //console.log(`requestmiddleware`, req);
    const token=req.header('x-token');
    if(token){
       // console.log(`token`, token);
        try {
            const payload=jwt.verify(
                token,
                process.env.SECRET_JWT);
            req.authUser=payload;    
        } catch (error) {
            console.log(`error`, error.message);
            return res.status(401).json({ ok:false, msg: [{msg:error.message}]});
        }
    }else{
        return res.status(401).json({ ok:false, msg: [{msg:'No se encuentra el parametro x-token en el header'}]});
    }
    next();
}
const loginValidator=[
    check('email').not().isEmpty().trim().escape().withMessage('No se mando el parametro email'),
    check('email').isEmail().normalizeEmail().withMessage('Debe ser formato email'),
    check('password').not().isEmpty().trim().escape().withMessage('No se mando el parametro password'),
    check('password').isLength({min:5}).withMessage('Debe tener mino 5 caracteres'),
    hasErrors
];

const registerValidator=[
    check('name').not().isEmpty().trim().escape().withMessage('No se mando el parametro name'),
...loginValidator
]



module.exports={
    loginValidator,registerValidator,validarToken
}