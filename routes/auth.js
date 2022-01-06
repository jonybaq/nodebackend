
/*
rutas para api/auth
*/
const express= require('express');
const { crearUsuario, loginUsuario, updateUsuario, validarTokenUser } = require('../controllers/auth');

const { loginValidator, registerValidator, validarToken } = require('../validators/authValidators');

const router=express.Router();
//get login
router.post('/',loginValidator,loginUsuario);
//post register
router.post('/new',registerValidator,crearUsuario);
//put update
router.put('/update',[validarToken],updateUsuario);

router.get('/renew',validarTokenUser);
module.exports=router;
//export default router;