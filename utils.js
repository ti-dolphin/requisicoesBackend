const fs = require("fs");

const utils = {
  removeFile: (filePath) => {
    fs.unlink(filePath, (err) => {
      if (err) console.log(err);
      else {
        console.log("\nDeleted file: ", filePath);
      }
    });
  },
};
module.exports = utils;
