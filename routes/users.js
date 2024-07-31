var express = require('express');
const userController = require('../controllers/userController');
var router = express.Router();
const ms = require("ms");

/* GET users listing. */
router.post('/login', async(req, res, next) => {
  const {user, token} = await userController.login(req, res, next);
  if(token){ 
     console.log({
       token: token,
       userID: user.CODPESSOA,
       message: "Login Successful",
     });
      res.status(201).send({token : token, user: user, message: 'Login Successful'});
  }else{ 
      res.status(400).send({ message: "Login not succesful" });
  }
});

module.exports = router;
