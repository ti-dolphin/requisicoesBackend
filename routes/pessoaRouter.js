var express = require("express");
var router = express.Router();
var pessoaController = require('../controllers/pessoaController')

router.get('/', async (req, res) => { 
    const [ result ] = await pessoaController.getAllPersons();
    if(result.length) res.status(200).send(result);
    else  res.status(404).send();
});
router.get("/:id", async (req, res) => {
   const [ result ] = await pessoaController.getPersonByID(req.params.id);
   if (result && result.length) res.status(200).send(result[0]);
   else res.status(404).send();
});

module.exports = router;

