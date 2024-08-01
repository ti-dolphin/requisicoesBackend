var express = require("express");
var router = express.Router();
const ProjectController = require("../controllers/projectController");

// GET /projects
router.get("/", (req, res) => {
  ProjectController.getAllProjects(req, res);
});

// GET /projects/:id
router.get("/:id", (req, res) => {
  ProjectController.getProjectById(req, res);
});

module.exports = router;
