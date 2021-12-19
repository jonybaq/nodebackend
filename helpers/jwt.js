const jwt  = require('jsonwebtoken');

const generarJWT=(id,name)=>{
 return new Promise((resolve,reject)=>{
     const payload={
         id,
         name
     }
     jwt.sign(
        payload,
        process.env.SECRET_JWT,
        {expiresIn:'2h'}, 
        (err,token)=>{
            if(err){
                console.log(`err`, err);
                reject('No se puede generar el token');
            }
            resolve(token);
        } );
 });
}





module.exports={
    generarJWT
}