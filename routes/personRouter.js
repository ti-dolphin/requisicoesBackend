const express = require("express");
const router = express.Router();
const PersonController = require("../controllers/PersonController");

router.get("/", PersonController.getAllPersons);
router.get("/:id", PersonController.getPersonByID);

module.exports = router;
