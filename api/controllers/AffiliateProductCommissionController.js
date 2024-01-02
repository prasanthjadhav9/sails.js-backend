const conf = {};
const appConfig = require('rc')('sails', conf);

/**
 * AffiliateProductCommissionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    
    update: async function(req, res) {
        const params = req.allParams();
        const hasDuplicateId = params.commission.some((item, index) => {
            return params.commission.findIndex(obj => obj.id === item.id) !== index;
        });
        if (hasDuplicateId) {
            return res.status(400).json({
                error: `Invalid commission input`
            });
        }
        const productDetails = await AffiliateProducts.findOne({
            id: params.productId
        });
        if (!productDetails) {
            return res.status(400).json({
                error: `Product Doesn't Exist`
            });
        }
        try {
            let getRecords = [];
            let profileTypeIds = params.commission.map(item => { return item.id });
            if (profileTypeIds.length > 0) {
                profileTypeIds = profileTypeIds.join(',');
                const getRecordsSql = `SELECT * FROM affiliate_product_commission where productId=${params.productId} AND startDate<=now() AND endDate>now() AND profileTypeId IN (${profileTypeIds})`;
                const getRecordsResult = await sails.sendNativeQuery(getRecordsSql,  []);
                getRecords = getRecordsResult.rows;
            }
            /* const getRecords = await AffiliateProductCommission.find({
                productId: params.productId,
                startDate: { '<': new Date() },
                endDate: { '>': new Date() },
                profileTypeId: params.commission.map(item => { return item.id })
            }); */
            const currentDateFormatted = new Date().toISOString().split('T')[0];
            const originalDate = new Date();
            if (getRecords && getRecords.length > 0) {
                await AffiliateProductCommission.update({
                    id: getRecords.map(item => { return item.id })
                }).set({
                    endDate: currentDateFormatted,
                    statusId: 0,
                    updatedBy: req.user.id
                });
            }
            for(let profileType of params.commission) {
                const foundType = await ProfileTypes.findOne({
                    id: profileType?.id,
                    statusId: 1
                });
                if (foundType) {
                    await AffiliateProductCommission.create({
                        productId: params.productId,
                        profileTypeId: profileType?.id,
                        commissionRate: profileType?.commissionRate,
                        startDate: currentDateFormatted,
                        endDate: new Date(originalDate.getFullYear() + 100, originalDate.getMonth(), originalDate.getDate()),
                        statusId: 1,
                        createdBy: req.user.id,
                        updatedBy: req.user.id
                    });
                    const currentCommission = getRecords.find(item => item.profileTypeId === profileType?.id);
                    if (currentCommission?.commissionRate !== profileType?.commissionRate) {
                        let getEmailListSql = `SELECT 
                            u.email AS emailList 
                        FROM 
                            users u 
                            INNER JOIN affiliate_profile_types apt ON u.id = apt.userId 
                            AND apt.statusId = 1 
                            AND apt.typeId = ${profileType?.id} 
                            INNER JOIN affiliate_profile ap ON u.id = ap.userId 
                            AND ap.profileVerified = 1 
                        WHERE 
                            u.statusId = 1 
                            AND u.id NOT IN (
                            SELECT 
                                userId 
                            FROM 
                                affiliate_product_user_commission apuc 
                            WHERE 
                                apuc.startDate <= NOW() 
                                AND apuc.endDate > NOW() 
                                AND apuc.statusId = 1 
                                AND apuc.productId = ${params.productId}
                            );`;
                        const emailListResult = await sails.sendNativeQuery(getEmailListSql,  []);
                        const productDetailsObj = {
                            productTitle: productDetails?.productTitle,
                            oldCommission: currentCommission?.commissionRate || 0,
                            newCommission: profileType?.commissionRate
                        }
                        let emails = [];
                        if (emailListResult.rows && emailListResult.rows.length > 0) {
                            emails = emailListResult.rows.map(item => { return item.emailList });
                        }
                        processEmailsAsBatch(emails, productDetailsObj);
                    }
                }
            }
            return res.json({
                message: `commission rates updated successfully !`
            });
        } catch (error) {
            console.log(error, "Error In Update Commission");
            return res.status(500).json({
                error: `Oops ! Failed to update commission details`
            });
        }
    }

};

async function processEmailsAsBatch(emails, productDetails, batchSize=30) {
    const batches = [];
    for (let i = 0; i < emails.length; i += batchSize) {
        batches.push(emails.slice(i, i + batchSize));
    }
    const emailObject = {
        "{{name}}": "Affiliate",
        "{{productName}}": productDetails?.productTitle,
        "{{oldCommission}}": productDetails?.oldCommission,
        "{{newCommission}}": productDetails?.newCommission,
        "{{companyName}}": appConfig.companyName
    }
    for (const batch of batches) {
        const emailTemplateResult = await sails.helpers.emailTemplates('commission-revision', emailObject);
        if (emailTemplateResult.status) {
            await EmailCron.create({
                toEmail: appConfig.sms.lambda['fromList']['verification'],
                fromEmail: appConfig.sms.lambda['fromList']['verification'],
                bcc: batch.join(','),
                subject: emailTemplateResult.subject,
                emailBody: emailTemplateResult.html,
                isHtmlBody: 1,
                emailResponse: JSON.stringify({}),
                isRequestProcessed: 0,
                scheduleDateTime: new Date().toISOString().split('T')[0]
            });
        }
    }
}

