const multer = require('multer');
const path = require('path');

 const multerConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.resolve('uploads'))
  },
  filename : (req, file, callback) => { 
    const time = new Date().getTime();
    callback(null, Buffer.from(file.originalname, "latin1").toString("utf8"));
  }
});
module.exports = multerConfig;