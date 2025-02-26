const { json } = require("express");
const pool = require("../database");

const ProjectService = require("../services/ProjectService");

class ProjectController {
  static async getAllProjects(req, res) {
    try {
      console.log('req.query: ', req.query);
      const {userID} = req.query;
      const projects = await ProjectService.getAllProjects(userID);
      if (projects) {
        res.status(200).send(projects);
      } else {
        res.status(404).send("Projects not found");
      }
    } catch (err) {
      console.log("Error in getAllProjects: ", err);
      res.status(500).send("Internal Server Error");
    }
  }

  static async getProjectById(req, res) {
    const { id } = req.params;
    try {
      const project = await ProjectService.getProjectById(id);
      if (project) {
        res.status(200).send(project);
      } else {
        res.status(404).send("Project not found");
      }
    } catch (err) {
      console.log("Error in getProjectById: ", err);
      res.status(500).send("Internal Server Error");
    }
  }
}

module.exports = ProjectController;
