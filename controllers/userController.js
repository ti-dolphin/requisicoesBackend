const crypto = require("crypto");
const pool = require("../database");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userController = {
  login: async (req) => {
    const { username, password } = req.body;
    const verification = await userController.verifyCredentials(
      username,
      password
    );
    if (verification.user) {
      const expiresIn = "1d";
      try {
        const token = jwt.sign(
          { username, password },
          process.env.SECRET_TOKEN,
          {
            expiresIn: "1 day",
          }
        );
        return { user: verification.user[0], token: token };
      } catch (e) {
        console.log("authorization error: ", e);
        return null;
      }
    }
    return null;
  },
  getManagerCode: async (userID) => {
    const query = "SELECT CODGERENTE FROM PESSOA WHERE CODPESSOA = ?";
    const [result] = await userController.executeQuery(query, [userID]);
    return result[0].CODGERENTE;
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
      console.log({
        message: "An error occurred",
        error: error.message,
      });
      return {
        message: "An error occurred",
        error: error.message,
      };
    }
  },

  isPurchaser: async (userID) => {
    const query =
      "SELECT CODPESSOA, PERM_COMPRADOR FROM PESSOA WHERE CODPESSOA = ? AND PERM_COMPRADOR = 1";
    try {
      const [result] = await userController.executeQuery(query, [userID]);
      if (result.length) {
        return true;
      }
      return false;
    } catch (e) {
      console.log("isPurchaser error: ", e);
      return null;
    }
  },
  isManager: async (userID) => {
    const query =
      "SELECT CODPESSOA, PERM_COMPRADOR FROM PESSOA WHERE CODPESSOA = ? AND CODGERENTE != 'null'";
    try {
      const [result] = await userController.executeQuery(query, [userID]);
      if (result.length) return true;
      return false;
    } catch (e) {
      console.log(e);
      return null;
    }
  },

  findOne: async (username, encryptedPassword) => {
    const query = `SELECT 
  CODPESSOA, 
  NOME, 
  LOGIN, 
  CODGERENTE, 
  PERM_REQUISITAR, 
  PERM_COMPRADOR, 
  PERM_ADMINISTRADOR, 
  PERM_CADASTRAR_PAT,
  responsavel_tipo
FROM 
  PESSOA 
  LEFT JOIN web_tipo_patrimonio ON web_tipo_patrimonio.responsavel_tipo = CODPESSOA
WHERE 
  LOGIN = ? 
  AND SENHA = ?
 
`;
    const [result] = await userController.executeQuery(query, [
      username,
      encryptedPassword,
    ]);
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
