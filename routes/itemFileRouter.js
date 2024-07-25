var express = require("express");
var router = express.Router();
const multerConfig = require("../multer");
const multer = require("multer");
const itemFileController = require("../controllers/itemFileController");
const upload = multer({ storage: multerConfig });

router.post('/:itemID', upload.single("file"), async(req, res) => { 
     if (req.file) {
       console.log('router');
       const response = await itemFileController.createItemFile(
         req.params.itemID,
         req.file
       );
       if (response) res.status(200).send(response);
     } else res.status(404).send();
});
router.post("/link/:itemID", async (req, res) => {
   if (req) {
     const response = await itemFileController.createItemFileFromLink(
       req.params.itemID,
       req
     );
     if (response) res.status(200).send(response);
   } else res.status(404).send();
});
router.get('/:itemID', async(req, res) => { 
    const response = await itemFileController.getItemFilesByFileId(req.params.itemID);
    if(response && response.length) res.status(200).send(response);
    else res.status(404).send();
});

router.delete('/:id', async(req, res ) => { 
  const response = await itemFileController.deleteItemFile(req.params.id);
  if(response) res.status(200).send('deleted successfully');
  else response.status(404).send();
})


module.exports = router;