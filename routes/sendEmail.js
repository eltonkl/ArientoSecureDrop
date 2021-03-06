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
var crypto = require('crypto');
var path = require('path');
var upload = path.resolve(__dirname) + "/../public/uploads";
var attachFiles = [];
var trackFiles = [];

var connection = mysql.createConnection({
  host: 'arientosenddb.cnrikh4cspia.us-west-2.rds.amazonaws.com',
  user: 'ariento',
  password: 'arientosend',
  database: 'ArientoSend_Database'
});

/* POST send mail */
router.post('/', function(req, res, next) {
  res.setTimeout(0);
  var date = new Date();
  var time = date.getMonth().toString() + date.getDate().toString() + date.getFullYear().toString() + "_" + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString();

  function Log (error) {
    console.log(error);
    fs.appendFile('./log/' + time, error + "\n", (err) => { if (err) console.log ("Error occurred writing to file"); });
  }

  fs.readdir(upload, function(err, files){
  if(err)
    Log("Error reading files to upload");

  files.forEach(function(file, index){
    var filePath = upload + "/" + file;
    trackFiles.push(filePath);
    var encryptedFile = crypto.randomBytes(20).toString('hex') + "@possible";
    var fileObject =  {
      filename: file,
      path: filePath,
      cid: encryptedFile
    }
    attachFiles.push(fileObject);
  });
});

  var sendTo = req.body.to;
  var message = req.body.message;

  var transporter = nodemailer.createTransport({ 
    host: 'smtp.office365.com',
    port: '587',
    auth: { user: 'ariento@ariento.org', pass: 'UCLA2017$$Colab' },
    secureConnection: false,
    tls: { ciphers: 'SSLv3' }
  });
  
  var mailOptions = {};
  var match = /@(.*)/.exec(sendTo)[1];
  var checkDatabase = 'SELECT company_name FROM company WHERE company_domain=' + connection.escape(match);

  connection.query(checkDatabase, function (error, results, fields) {
    if (error) {
      Log("Error reading database");
      res.render('sendEmail', { result: "An error occurred", message: "Your email has not been sent." });
      for(var i = 0; i < trackFiles.length; i++)
        fs.unlink(trackFiles[i]);
      attachFiles = [];
      trackFiles = [];
    }

    if (!results.length){
      console.log("Error: Recipient Email Is Not Secured");
      Log("Error: Recipient Email Is Not Secured");
      res.render('sendEmail', { result: "An error occurred", message: "Your email has not been sent (recipient email is not secured)." });
      for(var i = 0; i < trackFiles.length; i++)
        fs.unlink(trackFiles[i]);
      attachFiles = [];
      trackFiles = [];
      connection.end();
    }

    else {
      mailOptions = {
        from: 'ariento@ariento.org',
        to: sendTo,
        subject: "You have a secure message from " + req.body.from, 
        text: message,
        attachments: attachFiles
      } 

      transporter.sendMail(mailOptions, function(error, info) {
        if(error) {
          Log(error);
          for(var i = 0; i < trackFiles.length; i++)
            fs.unlink(trackFiles[i]);
          attachFiles = [];
          trackFiles = [];
        }

        Log("Message sent: " + JSON.stringify(info));

        if (error) {
          res.render('sendEmail', { result: "An error occurred", message: "Your email has not been sent." });
        } else {
          res.render('sendEmail', { result: "Success", message: "Your secure email has been sent." });
        }

        for(var i = 0; i < trackFiles.length; i++)
            fs.unlink(trackFiles[i]);
        attachFiles = [];
        trackFiles = [];
     })

    }

  });
  
});

module.exports = router;
