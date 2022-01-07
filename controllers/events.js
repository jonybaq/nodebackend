const Evento = require("../models/Evento");



const obtenerEvento = async (req, res) => {

    const eventos = await Evento.find().populate('user', 'name email');
    return res.json({
        ok: true,
        msg: [{msg:'Eventos obtenidos'}],
        eventos
    });

}
const crearEvento = (req, res) => {
    const event = req.body;
    //console.log(`req.body`, req.body);
    console.log(`req.payload`, req.authUser);
    const newEvent = new Evento({});
    newEvent.title = event.title;
    newEvent.start = event.start;
    newEvent.end = event.end;
    newEvent.user = req.authUser.id;
    if (event.notes) {
        newEvent.notes = event.notes;
    }
    newEvent.save().then((respuesta) => {
        return res.json({
            ok: true,
            msg: [{msg:'Evento Creado'}],
            event: respuesta
        });
    }).catch((err) => {

        return res.status(500).json({
            ok: false,
            msg: [{msg: err}]
        });


    });

}
const actualizarEvento = async (req, res) => {
    const { id } = req.params;
    const event = req.body;
    const authUser = req.authUser;
    const eventFind = await Evento.findOne({ _id: id });
    if (eventFind !== null) {
        if (authUser.id !== eventFind.user.toString()) {
            return res.status(401).json({
                ok: false,
                msg: [{msg:'No se puede modificar un evento realizado por otro usuario'}]
            });
        } else {

            if (event.title) {
                eventFind.title = event.title;
            }
            if (event.start) {
                eventFind.start = event.start;
            }
            if (event.end) {
                eventFind.end = event.end;
            }
            if (event.notes) {
                eventFind.notes = event.notes;
            }
            if (event.user) {
                eventFind.user = event.user;
            }

            eventFind.save().then((respuesta) => {
                return res.json({
                    ok: true,
                    msg: [{msg:'Update event'}],
                    event: respuesta
                });
            }).catch((err) => {
                // console.log(`error`, err);

                return res.status(406).json({
                    ok: false,
                    msg: [{msg:'error'}]
                });


            });


        }


    } else {
        return res.status(406).json({
            ok: false,
            msg: [{msg:'Evento no existente'}]
        });
    }

}
const borrarEvento = (req, res) => {
    const { id } = req.params;

    Evento.deleteOne({ _id: id }).then((respuesta) => {
        return res.json({
            ok: true,
            msg: [{msg:'Evento Eliminado ',respuesta}]
        });
    }).catch((err) => {
        return res.status(406).json({
            ok: false,
            msg: [{msg:error.message}]
        });
    });
}

module.exports = {
    obtenerEvento, crearEvento, actualizarEvento, borrarEvento
}