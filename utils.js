const fs = require("fs");

const utils = {
  removeFile: (filePath) => {
    fs.unlink(filePath, (err) => {
      if (err) console.log(err);
      
    });
  },
  getSQLFormatedDate : ( dateReceived) => { 
    if(dateReceived === null || dateReceived === undefined || dateReceived === ''){ 
      return null
    }
    let date = new Date(dateReceived);
    const opcoes = {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
     date = date
      .toLocaleString("sv-SE", opcoes)
      .replace("T", " ");
    return `'${date}'`;
  },
  getCurrentDateTime : ( ) => { 
       const nowDateTime = new Date();
       const opcoes = {
         timeZone: "America/Sao_Paulo",
         year: "numeric",
         month: "2-digit",
         day: "2-digit",
         hour: "2-digit",
         minute: "2-digit",
         second: "2-digit",
         hour12: false,
       };
       const nowDateTimeInBrazil = nowDateTime
         .toLocaleString("sv-SE", opcoes)
         .replace("T", " ");
         return nowDateTimeInBrazil;
  }
};
module.exports = utils;
