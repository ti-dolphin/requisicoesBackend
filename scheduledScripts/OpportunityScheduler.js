const OpportunityService = require('../services/OpportunityService');


class OpportunityScheduler{ 
    static startExpiredOppsVerification = () => {
        const oneHourInMilliseconds = 1 * 60 * 60 * 1000;
        const day = 24 * oneHourInMilliseconds;
        const interval = 6 * day;
        setInterval(async () => {
            try {
                const oppsByManager = await OpportunityService.getOppsByManager();
                const oppsByComercialResponsable = await OpportunityService.getOppsByComercialResponsable()
                await OpportunityService.sendManagerOppExpirationEmail(oppsByManager);
                await OpportunityService.sendSalesReportEmail(oppsByComercialResponsable);
            } catch (e) {
                console.error("Error during checklist verification:", e);
            }
        }, interval);
    }
}
module.exports = OpportunityScheduler