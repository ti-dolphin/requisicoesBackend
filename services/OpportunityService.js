const OpportunityRepository = require('../repositories/OpportunityRepository');
const pool = require("../database");

class OpportunityService {

  static getOpportunities = async () => { 
        const opps = await this.executeQuery(
            OpportunityRepository.getOpportunitiesQuery()
        );
        return opps;

  };
   static async executeQuery(query, params) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(query, params);
      connection.release();
      return result;
    } catch (queryError) {
      console.log("Error in executeQuery: ", queryError);
      connection.release();
      throw queryError;
    }
  }
}
module.exports = OpportunityService;