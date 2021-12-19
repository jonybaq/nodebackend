
/*
rutas para api/auth
*/
const express= require('express');
const { crearUsuario, loginUsuario, updateUsuario } = require('../controllers/auth');

const { loginValidator, registerValidator, validarToken } = require('../validators/authValidators');

const router=express.Router();
//get login
router.get('/',loginValidator,loginUsuario);
//post register
router.post('/new',registerValidator,crearUsuario);
//put update
router.put('/update',[validarToken],updateUsuario);
module.exports=router;
//export default router;