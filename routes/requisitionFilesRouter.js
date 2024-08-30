var express = require("express");
var router = express.Router();
const multerConfig = require("../multer");
const multer = require("multer");
const RequisitionFilesController = require("../controllers/requisitionFilesController");

const upload = multer({ storage: multerConfig });

router.post(
  "/:requisitionID",
  upload.single("file"),
  RequisitionFilesController.createRequisitionFile
);

router.post("/link/:requisitionID", RequisitionFilesController.createRequisitionFileFromLink);

router.get("/:requisitionID", RequisitionFilesController.getRequisitionFiles);

router.delete("/:filename/:fileID", RequisitionFilesController.deleteRequisitionFile);


// router.post("/:requisitionID", upload.single("file"), async (req, res, next) => {
//         if (req.file){ 
//           const response = await requisitionFilesController.createRequisitionFile(
//             req.params.requisitionID,
//             req.file
//           );
//           if(response) res.status(200).send(response);
//         }
//         else res.status(404).send();
// });

// router.post("/link/:requisitionID", async (req, res) => {
//   if (req.body) {
//     const response = await requisitionFilesController.createRequisitionFileFromLink(
//       req.params.requisitionID,
//       req
//     );
//     if (response) res.status(200).send(response);
//   } else res.status(404).send();
// });


// router.get("/:requisitionID", async (req, res) => {
//         const result = await requisitionFilesController.getRequisitionFiles(
//           req.params.requisitionID
//         );
//         if (result && result.length) return res.status(200).send(result);
//         else return res.status(404).send();
// });

// router.delete('/:fileID', async(req, res) =>  {
//       const result = await requisitionFilesController.deleteRequisitionFile(req.params.fileID);
//       if(result) res.status(200).send('success');
//       else res.status(404).send('something went wrong');
// });

module.exports = router;
