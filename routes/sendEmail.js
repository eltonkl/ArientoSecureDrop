var express = require('express');
var router = express.Router();

var aws = require('aws-sdk');
var fromEmail = require('../from-email.json');
var from = fromEmail.address;
aws.config.loadFromPath('aws-config.json');
aws.config.correctClockSkew = true;

var ses = new aws.SES({apiVersion: '2010-12-01'});

/* POST send mail */
router.post('/', function(req, res, next) {
  var to = req.body.to;
  

  if (!to) {
    var response = { 'result': 'failure', 'reason': 'No email given.'};
    res.json(response);
  } else {
    ses.sendEmail( {
      Source: from,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: {
          Data: 'Test'
        },
        Body: {
          Text: {
            Data: 'Test'
          }
        }
      }
    }
    , function(err, data) {
        var response = {};
        if (err) {
          response.result = 'failure';
          response.reason = err;
        } else {
          response.result = 'success';
        }
        res.json(response);
    });
  }
});

module.exports = router;
