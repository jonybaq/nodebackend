const { check,validationResult } = require('express-validator');
const { isDate } = require('../helpers/functions');


const hasErrors=(req,res=response,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ ok:false, msg: [{msg:errors.array()}] });
    }
    next();
}

const registerEventValidator=[
    check('title').not().isEmpty().trim().escape().withMessage('No se mando el parametro title'),
    check('start').custom(isDate).withMessage('No es formato fecha el parametro start'),
    check('end').custom(isDate).withMessage('No es formato fecha el parametro end'),
    hasErrors
];


module.exports={
    registerEventValidator
}