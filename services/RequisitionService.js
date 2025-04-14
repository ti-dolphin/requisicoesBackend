const { json } = require("express");
const pool = require("../database");
const userController = require("../controllers/userController");
const RequisitionRepository = require("../repositories/RequisitionRepository");

class RequisitionService {

  static async getStatusList  ( ) { 
    try{ 
      const list = await this.executeQuery(RequisitionRepository.getStatusListQuery);
      return list;
    }catch(e){ 
      console.log('erro ao buscar status: ', e.message);
      throw e;
    }
  }

  static async getTypes(){ 
    const types = await this.executeQuery(
      RequisitionRepository.getTypesQuery()
    );
    return types;
  }
  
  static async getRequisitions(){
     
    try {
      const rows = await this.executeQuery(RequisitionRepository.getAll());
      console.log('rows: ', rows)
      return rows;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  static async getRequisitionByID(id) {
    const query = RequisitionRepository.getById();
    try {
      const [requisition] = await this.executeQuery(query, [id]);
      return requisition;
    } catch (err) {
      throw err;
    }
  }

  static async insertRequisitions(body) {
    try {
      console.log(body)
      const query = RequisitionRepository.insertRequisition(body);
      const resultSetHeader = await this.executeQuery(query, []);
      return resultSetHeader;
    } catch (err) {
      throw err;
    }
  }

  static async updateRequisitionById(codpessoa, requisition) {
    try {
      const query = await RequisitionRepository.update(codpessoa, requisition);
      const result = await this.executeQuery(query);
      return result;
    } catch (err) {
      console.log("erro no execute / setquery: ", err);
      return null;
    }
  }

  static async deleteRequisitionById(requisitionID) {
    const query =
      "DELETE from WEB_REQUISICAO WHERE ID_REQUISICAO = " + requisitionID;
    try {
      const result = await this.executeQuery(query);
      return result;
    } catch (err) {
      console.log("err: ", err);
      return null;
    }
  }

  static async executeQuery(query, params) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(query, params);
      connection.release();
      return result;
    } catch (queryError) {
      console.log("queryError: ", queryError);
      connection.release();
      throw queryError;
    }
  }
}

module.exports = RequisitionService;
