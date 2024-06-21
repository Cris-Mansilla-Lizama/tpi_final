var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var novedadesModel = require('../models/novedadesModel')
var cloudinary = require('cloudinary').v2;



/* GET home page. */
router.get('/', async function (req, res, next) {

  var novedades = await novedadesModel.getNovedades();
  novedades = novedades.splice(0, 8);    //seleccionalos 8 primeros elementos del array
  novedades = novedades.map(novedad => {
    if (novedad.img_id) {
      const imagen = cloudinary.url(novedad.img_id, {
        width: 460,
        crop: 'fill'
      });
      return {
        ...novedad,
        imagen
      }
    } else {
      return {
        ...novedad,
        imagen: '/images/logo.jpg'
      }
    }
  });

  res.render('index', {
    novedades
  });
});



router.post('/', async (req, res, next) => {

  var nombre = req.body.nombre;
  var apellido = req.body.apellido;
  var email = req.body.email;
  var tel = req.body.tel;
  var ciudad = req.body.ciudad;
  var provincia = req.body.provincia;
  var mensaje = req.body.mensaje;

  var obj = {
    to: 'mansillalizamacristian@gmail.com',
    subject: 'Mensaje desde la web de Pelitos Contentos',
    html: nombre + " " + apellido + " se ha comunicado a través de la web con el siguiente mensaje: " + mensaje + ", su correo es: " + email + ", su teléfono es: " + tel + ", y nos escribe desde la ciudad de " + ciudad + " provincia de " + provincia + "."
  }

  var transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  var info = await transport.sendMail(obj);

  res.render('index', {
    message: 'Mensaje enviado correctamente'
  });

});

module.exports = router;
