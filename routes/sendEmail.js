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
var mysql = require('mysql');
var fs = require('fs');
var path = require('path');
var upload = path.resolve(__dirname) + "/../public/uploads";
var attachFiles = [];

var connection = mysql.createConnection({
  host: '***REMOVED***',
  user: 'ariento',
  password: '***REMOVED***',
  database: '***REMOVED***'
});

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
  var message = req.body.message;

  var transporter = nodemailer.createTransport({ 
    host: 'smtp.office365.com',
    port: '587',
    auth: { user: '***REMOVED***', pass: '***REMOVED***' },
    secureConnection: false,
    tls: { ciphers: 'SSLv3' }
  });
  
  var mailOptions = {};
  var match = /@(.*)/.exec(sendTo)[1];
  var checkDatabase = 'SELECT company_name FROM company WHERE company_domain=' + connection.escape(match);

  connection.connect();
  connection.query(checkDatabase, function (error, results, fields) {
    if (error) throw error;

    if (!results.length){
      console.log("Error: Recipient Email Is Not Secured");
      connection.end();
    }

    else {
      mailOptions = {
        from: '***REMOVED***',
        to: sendTo,
        subject: results[0].company_name, 
        text: message,
        attachments: attachFiles
      } 

      transporter.sendMail(mailOptions, function(error, response) {
        if(error)
          console.log(error);
        console.log("message sent: ", response);
        connection.end();
     })

    }

  });
  
});

module.exports = router;
