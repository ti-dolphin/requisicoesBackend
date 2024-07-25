const crypto = require("crypto");
const pool = require("../database");
const jwt = require('jsonwebtoken');
require("dotenv").config();

const userController = {
  login: async (req) => {
    const { username, password } = req.body;
    const verification = await userController.verifyCredentials(username, password);
    if(verification.user){ 
       console.log("verification.user: ", verification.user);
       const expiresIn = '1d'
        try{ 
          const token = jwt.sign(
          {username, password},
          process.env.SECRET_TOKEN,
          { 
            expiresIn : '1 day',
          });
          return token
          
        }catch(e){ 
          console.log('authorization error: ', e);
           return null;
        }
    }
    return null;
  },

  verifyCredentials: async (username, password) => {
    try {
      let hash = crypto.createHash("md5").update(password).digest("hex");
      const user = await userController.findOne(
        username.toUpperCase(),
        hash.toUpperCase()
      );
      if (!user) {
        return {
          message: "Login not successful",
          error: "User not found",
        };
      } else {
        return {
          message: "Login successful",
          user,
        };
      }
    } catch (error) {
        return {
          message: "An error occurred",
          error: error.message,
        };
    }
  },

  findOne: async (username, encryptedPassword) => {
    const query =
      "SELECT LOGIN, SENHA FROM PESSOA WHERE LOGIN = ? AND SENHA = ?";
    const [result] = await userController.executeQuery(query, [
      username,
      encryptedPassword,
    ]);
    console.log("findOne result:  ", result);
    if (result.length) {
      return result;
    }
    return null;
  },
  executeQuery: async (query, params) => {
    const connection = pool.getConnection();
    try {
      const result = (await connection).query(query, params);
      (await connection).release();
      return result;
    } catch (queryError) {
      console
        .log(
          "queryErro: ",
          queryError
        )(await connection)
        .release();
      throw queryError;
    }
  },
};
module.exports = userController;
