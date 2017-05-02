var express = require('express');
var router = express.Router();

//TODO: FIGURE OUT EMAIL SEND!!!

//var aws = require('aws-sdk');
//ar fromEmail = require('../from-email.json');
//var from = fromEmail.address;
//aws.config.loadFromPath('aws-config.json');
//aws.config.correctClockSkew = true;

//var ses = new aws.SES({apiVersion: '2010-12-01'});
//var ses = require('node-ses');
//var client = ses.createClient({ key: "AKIAI3AKLHSWB2KGQVPQ", secret:"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" });

var nodemailer = require('nodemailer');

/* POST send mail */
router.post('/', function(req, res, next) {
  var to = req.body.to;
  var transporter = nodemailer.createTransport('SMTP', {
    service: 'gmail',
    auth: {
      user: 'arientosecuredrop@gmail.com',
      pass: 'dylanhoang'
    }
  });

  var mailOptions = {
    from: 'Sender: <arientosecuredrop@gmail.com>',
    to: 'Receiver: <arientosecure@gmail.com>',
    subject: 'Hello ', 
   // text: 'Hello',
   // attachments: [
    //  {
     //   path: '/public/uploads/a.txt'
      //}
   // ]
  }

  transporter.sendMail(mailOptions, function(error, response) {
      console.log("message sent:");
   })
});

module.exports = router;
