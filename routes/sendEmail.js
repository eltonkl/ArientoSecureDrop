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
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'ariento.test.cs130@gmail.com',
      pass: 'ariento_cs130'
    }
  });

  var mailOptions = {
    from: 'Sender: <ariento.test.cs130@gmail.com>',
    to: 'Receiver: <matthewallenlin@gmail.com>',
    subject: 'Hello ', 
    text: 'Hello',
    attachments: [
       {
         filename: 'image.png',
         path: 'http://www.clipartbest.com/cliparts/acq/ddo/acqddoGcM.png',
         cid: 'image.png'
        }
     ]
  }

  transporter.sendMail(mailOptions, function(error, response) {
      console.log("message sent:");
   })
});

module.exports = router;
