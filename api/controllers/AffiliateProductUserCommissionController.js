const conf = {};
const appConfig = require('rc')('sails', conf);
/**
 * AffiliateProductUserCommissionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    searchUser: async function(req, res) {
        const params = req.allParams();
        params.keyword = params.keyword ? params.keyword.replace(/'/g, '') : '';
        const sql = `SELECT
            u.id,
            u.name,
            u.email,
            apuc.commissionRate,
            apuc.endDate,
            apuc.updatedAt,
            apt.typeId as profileTypeId
        FROM 
            users u 
            LEFT JOIN affiliate_product_user_commission apuc ON apuc.userId = u.id AND apuc.statusId = 1
            AND apuc.endDate > now() 
            AND apuc.statusId = 1 
            AND apuc.productId = ${params.productId}
            LEFT JOIN affiliate_profile_types apt ON apt.userId = u.id AND apt.statusId = 1
        where 
            u.emailVerified = 1 
            and u.statusId = 1 
            and u.roleId = 1
            and (u.name LIKE '%${params.keyword}%' OR u.email LIKE '%${params.keyword}%')
            and apt.typeId > 0
        order by 
            u.name asc limit 0,10`;
        const result = await sails.sendNativeQuery(sql,  []);
        return res.json(result.rows);
    },

    getList: async function(req, res) {
        const params = req.allParams();
        const sql = `SELECT 
            u.id, 
            u.name, 
            u.email,
            apuc.id as affiliateProductUserCommissionId,
            apuc.commissionRate,
            apuc.endDate,
            apuc.updatedAt,
            apt.typeId as profileTypeId
        FROM 
            affiliate_product_user_commission apuc 
            INNER JOIN users u ON u.id = apuc.userId
            LEFT JOIN affiliate_profile_types apt ON apt.userId = u.id AND apt.statusId = 1
        where 
            apuc.productId = ${params.productId} 
            and apuc.startDate <= now() 
            and apuc.endDate > now() 
            and apuc.statusId = 1`;
        const result = await sails.sendNativeQuery(sql,  []);
        return res.json(result.rows);
    },

    updateCommissionDetails: async function(req, res) {
        const params = req.allParams();
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);
        const newEndDate = new Date();
        newEndDate.setFullYear(newEndDate.getFullYear() + 100);
        try {
            const getActiveRecord = await AffiliateProductUserCommission.findOne({
                userId: params.userId,
                productId: params.productId,
                startDate: {
                    '<=': new Date()
                },
                endDate: {
                    '>': new Date()
                },
                statusId: 1
            });
            if (getActiveRecord) {
                await AffiliateProductUserCommission.updateOne({
                    id: getActiveRecord.id
                }).set({
                    statusId: 0,
                    endDate: currentDate.toISOString().split('T')[0],
                    updatedBy: req.user.id
                });
            }
            const createResult = await AffiliateProductUserCommission.create({
                productId: params.productId,
                userId: params.userId,
                commissionRate: params.commission,
                createdBy: req.user.id,
                updatedBy: req.user.id,
                statusId: 1,
                startDate: new Date().toISOString().split('T')[0],
                endDate: params.endDate || newEndDate.toISOString().split('T')[0]
            }).fetch();
            const fetchCommissionAllDetails = await AffiliateProductUserCommission.findOne({
                id: createResult.id
            }).populateAll();
            if (fetchCommissionAllDetails) {
                let emailParams = {
                    "{{name}}": fetchCommissionAllDetails.userId.name,
                    "{{productName}}": fetchCommissionAllDetails.productId.productTitle,
                    "{{oldCommission}}": getActiveRecord ? getActiveRecord.commissionRate : 0,
                    "{{commission}}": fetchCommissionAllDetails.commissionRate,
                    "{{companyName}}": appConfig.companyName
                };
                const emailTemplateType = getActiveRecord ? 'user-special-commission-modified' : 'user-special-commission-assigned';
                await emailNotify(emailTemplateType, fetchCommissionAllDetails.userId.email, emailParams);
            }
            return res.json({
                message: `Commission Request Proceed Successfully !`
            });
        } catch (error) {
            return res.json({
                error: `Oops ! unable to process your request at this moment`
            });
        }
    },

    removeUserCommission: async function(req, res) {
        const params = req.allParams();
        const getActiveRecord = await AffiliateProductUserCommission.findOne({
            id: params.affiliateProductUserCommissionId,
            userId: params.userId
        }).populateAll();
        if (getActiveRecord) {
            await AffiliateProductUserCommission.updateOne({
                id: getActiveRecord.id
            }).set({
                statusId: 0,
                updatedBy: req.user.id
            });
            const sql = `SELECT 
                productId, 
                commissionRate 
            FROM 
                affiliate_product_commission apc 
                INNER JOIN affiliate_profile_types apt ON apt.typeId = apc.profileTypeId 
                AND apt.userId = ${getActiveRecord.userId.id} 
            where 
                apc.startDate <= now() 
                AND apc.endDate > now() 
                AND apc.statusId = 1 
                AND apc.productId = ${getActiveRecord.productId.id};`
            const sqlResult = await sails.sendNativeQuery(sql,  []);
            const profileTypeCommission = sqlResult.rows[0];
            let emailParams = {
                "{{name}}": getActiveRecord.userId.name,
                "{{productName}}": getActiveRecord.productId.productTitle,
                "{{oldCommission}}": getActiveRecord ? getActiveRecord.commissionRate : 0,
                "{{commission}}": getActiveRecord.commissionRate,
                "{{companyName}}": appConfig.companyName,
                "{{defaultCommission}}": profileTypeCommission.commissionRate
            };
            const emailTemplateType = 'user-special-commission-removed';
            await emailNotify(emailTemplateType, getActiveRecord.userId.email, emailParams);
            return res.json({
                message: `Commission remove request processed successfully !`
            });
        }
        return res.status(400).json({
            message: `Oops ! Record Doesn't Exist`
        });
    }

};
/*
    type = 'user-special-commission-assigned | user-special-commission-modified | user-special-commission-removed'
    emailObject = {
        "{{name}}": "John Doe",
        "{{productName}}": "FullStack Development Course",
        "{{oldCommission}}": 10,
        "{{commission}}": 15,
        "{{companyName}}": "IndStack",
        "{{defaultCommission}}": 5
    }
*/
async function emailNotify(type, userEmail, emailDynamicData) {
    let emailTemplateResult;
    emailTemplateResult = await sails.helpers.emailTemplates(type, emailDynamicData);
    if (emailTemplateResult.status) {
        await EmailCron.create({
            toEmail: userEmail,
            fromEmail: appConfig.sms.lambda['fromList']['verification'],
            bcc: "",
            subject: emailTemplateResult.subject,
            emailBody: emailTemplateResult.html,
            isHtmlBody: 1,
            emailResponse: JSON.stringify({}),
            isRequestProcessed: 0,
            scheduleDateTime: new Date().toISOString().split('T')[0]
        });
        return true;
    } else {
        return false;
    }
}