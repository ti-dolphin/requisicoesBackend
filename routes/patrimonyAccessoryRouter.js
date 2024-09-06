const express = require("express");
const PatrimonyAccessoryController = require("../controllers/patrimonyAccessoryController");
const multerConfig = require("../multer");
const multer = require("multer");
const upload = multer({ storage: multerConfig });
const router = express.Router();

router.post("/", PatrimonyAccessoryController.createAccessory);
router.get("/:id", PatrimonyAccessoryController.getAccessoryById);
router.put("/:id", PatrimonyAccessoryController.updateAccessory);
router.delete("/:id", PatrimonyAccessoryController.deleteAccessory);
router.get(
  "/patrimony-accessory/:id_patrimonio",
  PatrimonyAccessoryController.getAccessoriesByPatrimonyId
);
router.get(
  "/files/:accessoryId",
  PatrimonyAccessoryController.getFilesByAccessoryId
);
router.delete(
  "/files/:filename/:id_anexo_acessorio_patrimonio",
  PatrimonyAccessoryController.deletPatrimonyAccessoryFile
);

router.post(
  "/files/:id_acessorio_patrimonio", upload.single("file"),  PatrimonyAccessoryController.createPatrimonyAccessoryFile
);


module.exports = router;
