const OpportunityService = require('../services/OpportunityService')

class OpportunityController{ 
        static  getOpportunities =  async (req, res ) => { 
            try{ 
                const opps = await OpportunityService.getOpportunities();

            }catch(e){ 
                console.log('error getting opportunities: ', e.message);  
                res.status(500).json({error: e.message});
            }
        }   
}

module.exports = OpportunityController;