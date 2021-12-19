const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async (req, res) => {
    const { name, email, password } = req.body;
    //hasErrors(req,res);
    if (await verificarEmail(email)) {
        //encrepitar password
        const salt = bcrypt.genSaltSync();

        const newUser = new User({ name, email, password });
        newUser.password = bcrypt.hashSync(password, salt);
        newUser.save().then(async (respuesta) => {
            const token=await generarJWT(respuesta._id,respuesta.name);
            return res.status(201).json({
                ok: true,
                msg: 'Register',
                user: {
                    id: respuesta._id,
                    name: respuesta.name,
                    email: respuesta.email,
                    token
                }
            });
        });
    } else {
        return res.status(406).json({
            ok: false,
            msg: 'Ya existe un usuario con ese correo electronico'
        });
    }
}

const verificarEmail = async (email) => {
    const query = await User.findOne({ email });
    if (query === null) {
        //console.log(`mensaje`, 'true');
        return true;
    } else {
       // console.log(`mensaje`, 'false');
        return false;
    }
}

const loginUsuario = async (req, res) => {

    const { email, password } = req.body;
    const userFind = await User.findOne({ email });
    if (userFind !== null) {

        if (bcrypt.compareSync(password, userFind.password)) {
            //crea JWT
            const token=await generarJWT(userFind.id,userFind.name);
            //console.log(`token`, token);
            return res.json({
                ok: true,
                msg: 'Usuario Validado',
                user: {
                    id: userFind.id,
                    name: userFind.name,
                    email: userFind.email,
                    token
                }
            });
        } else {
            return res.status(406).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }
    } else {
        return res.status(406).json({
            ok: false,
            msg: 'Correo electronico no existente'
        });
    }

}

const updateUsuario = async (req, res) => {

    const user = req.body;
    //console.log(`user`, user);
    const userFind = await User.findOne({_id:user.id});
//console.log(`userFind`, userFind);
    if (userFind !== null) {
        
            if(user.name){
                userFind.name=user.name;
            }
            if(user.email){
                userFind.email=user.email;
            }
            if(user.password){
                const salt = bcrypt.genSaltSync();
                userFind.password=bcrypt.hashSync(user.password, salt);
            }
            userFind.save().then(async(respuesta) => {
                const token=await generarJWT(respuesta._id,respuesta.name);
                return res.json({
                    ok: true,
                    msg: 'Update user',
                    user: {
                        id: respuesta._id,
                        name: respuesta.name,
                        email: respuesta.email,
                        token
                    }
                });
            }).catch((err)=>{
               // console.log(`error`, err);
                if (err.code===11000) {
                    return res.status(406).json({
                        ok: false,
                        msg: `Error valor unico ${JSON.stringify(err.keyValue)}`
                    });
                } else {
                    return res.status(406).json({
                        ok: false,
                        msg: 'error'
                    });
                }
                
            });
        
            
            
        
       
    }else{
        return res.status(406).json({
            ok: false,
            msg: 'Usuario no existente'
        });
    }
}

module.exports = {
    crearUsuario, loginUsuario,updateUsuario
}