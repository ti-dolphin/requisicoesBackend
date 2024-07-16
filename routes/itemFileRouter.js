var express = require("express");
var router = express.Router();
const multerConfig = require("../multer");
const multer = require("multer");
const itemFileController = require("../controllers/itemFileController");
const upload = multer({ storage: multerConfig });

router.post('/:itemID', upload.single("file"), async(req, res) => { 
     if (req.file) {
       const response = await itemFileController.createItemFile(
         req.params.itemID,
         req.file
       );
       if (response) res.status(200).send(response);
     } else res.send(404);

});

router.get('/:itemID', async(req, res) => { 
    console.log('GET - itemFileController')
    const response = await itemFileController.getItemFilesByFileId(req.params.itemID);
    if(response && response.length) res.status(200).send(response);
    else res.status(404).send();
});

router.delete('/:id', async(req, res ) => { 
  console.log("DELETE - itemFileController");
  const response = await itemFileController.deleteItemFile(req.params.id);
  if(response) res.status(200).send('deleted successfully');
  else response.status(404).send();
})


module.exports = router;