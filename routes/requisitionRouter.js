var express = require("express");
var router = express.Router();
const requisitonController = require("../controllers/requisitionController");
const pool = require("../database");

// GET /requisition/
router.get('/', async (req, res, next) => {
    const [ result ] = await requisitonController.getRequisitions();

    if (result && result.length) res.status(200).send(result);
    else  res.status(404).send("Ops, algo deu errado!");
});

router.get('/:id', async ( req, res ) => { 
    const [result] = await requisitonController.getRequisitionByID(req.params.id);
    console.log(result);
    if (result && result.length) res.status(200).send(result[0]);
    else res.status(404).send("Ops, algo deu errado!");
});

router.post("/", async (req, res, next) => {
  const result = await requisitonController.insertRequisitions(req.body);
  if (result) res.status(200).send(`${result.insertId}`);
  else res.status(404).send();
});
// PUT /requistion/:requisitionID
router.put("/:requisitionID", async (req, res, next) => {
  console.log('PUT');
  console.log('body', req.body);
  const result = await requisitonController.updateRequisitonById(
    req.body,
    req.params.requisitionID
  );
  if (result) res.status(200).send("success");
  else res.status(404).send("Algo deu errado, não foi possível atualizar o registro");
});

//delete /requisition/:requisitionID
router.delete("/:requisitionID", async (req, res, next) => {
    console.log('requisição: ', req);
    const result = await requisitonController.deleteRequisitionById( req.params.requisitionID );
    if(result) res.status(200).send("success");
    else res.status(404).send("Algo deu errado, não foi possível deletar o registro");

});
module.exports = router;
