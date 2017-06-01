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
var fs = require('fs');
var path = require('path');
var upload = path.resolve(__dirname) + "/../public/uploads";
var attachFiles = [];

fs.readdir(upload, function(err, files){
  if(err)
    console.log("err");
  
  files.forEach(function(file, index){ 
    var fileObject =  {
      filename: file,
      path: upload + "/" + file,
      cid: file
    }
    attachFiles.push(fileObject);
  });
});

/* POST send mail */
router.post('/', function(req, res, next) {
  var sendTo = req.body.to;

  var transporter = nodemailer.createTransport({ 
    host: 'smtp.office365.com',
    port: '587',
    auth: { user: '***REMOVED***', pass: '***REMOVED***' },
    secureConnection: false,
    tls: { ciphers: 'SSLv3' }
});
  
  var mailOptions = {};
  if(sendTo.match(/\b@ariento.org/g)){
    mailOptions = {
      from: '***REMOVED***',
      to: sendTo,
      subject: 'Hello ', 
      text: 'Hello',
      attachments: attachFiles
    } 
  }

  else{
    console.log("Error: Recipient Email Is Not Secured");
  }

  transporter.sendMail(mailOptions, function(error, response) {
      if(error)
        console.log(error);
      console.log("message sent: ", response);
   })
});

module.exports = router;
