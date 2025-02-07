const multer = require('multer');
const path = require('path');

 const multerConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.resolve('uploads'))
  },
  filename : (req, file, callback) => { 
    const time = new Date().getTime();
    const randomRef = Math.floor(Math.random() * 1000000);
    const uniqueName = `${randomRef}-${time}`
    callback(null,uniqueName);
  }
});
module.exports = multerConfig;