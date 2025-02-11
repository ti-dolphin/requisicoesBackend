const multer = require('multer');
const path = require('path');

 const multerConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.resolve('uploads'))
  },
  filename : (req, file, callback) => { 
    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const time = new Date().getTime();
    const randomRef = Math.floor(Math.random() * 1000000);
    const uniqueName = `${randomRef}${originalName}`
    callback(null,uniqueName);
  }
});
module.exports = multerConfig;