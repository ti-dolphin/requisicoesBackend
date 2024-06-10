var express = require("express");
var router = express.Router();
var projectController = require('../controllers/projectController');

router.get('/', async (req, res ) =>  {
     const [result] = await projectController.getAllProjects();
     if (result.length) res.status(200).send(result);
     else res.status(404).send("Ops, algo deu errado!");
});
router.get('/:id', async ( req, res ) => { 
    const [ result ] = await projectController.getProjectById(req.params.id);
    if (result && result.length) res.status(200).send(result);
    else res.status(404).send();
});

module.exports = router;