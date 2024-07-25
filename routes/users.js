var express = require('express');
const userController = require('../controllers/userController');
var router = express.Router();
const ms = require("ms");

/* GET users listing. */
router.post('/login', async(req, res, next) => {
  const token = await userController.login(req, res, next);
  if(token){ 
      res.status(201).send({token, message: 'Login Successful'});
     
  }else{ 
      res.status(400).send({ message: "Login not succesful" });
  }
});

module.exports = router;
