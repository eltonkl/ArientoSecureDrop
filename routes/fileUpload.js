var express = require('express');
var router = express.Router();

var multer = require('multer');

//Right now we just store uploaded files to a directory in public
///TODO: Figure out file validation for security

var storage = multer.diskStorage({
  destination:function(req,file,cb) {
    cb(null,'public/uploads')
  },
  filename:function(req,file,cb){
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage});

router.post('/', upload.single('file'), function(req, res, next) {
  return res.status(200).send(req.file);
});

module.exports = router;
