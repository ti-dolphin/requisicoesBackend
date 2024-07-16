const fs = require("fs");

const utils = {
  removeFile: (filePath) => {
    fs.unlink(filePath, (err) => {
      if (err) console.log(err);
      
    });
  },
};
module.exports = utils;
