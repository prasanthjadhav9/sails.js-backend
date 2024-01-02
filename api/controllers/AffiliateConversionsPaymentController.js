/**
 * AffiliateConversionsPaymentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    
    getConversionPaymentDetails: async function(req, res) {
        const params = req.allParams();
        console.log(params);
        const result = await AffiliateConversionsPayment.findOne({
            affiliateTrackUserId: params.conversionId
        }).populateAll();
        console.log(result);
        if (result) {
            if (result && result.affiliateTrackUserId && result.affiliateTrackUserId.affiliateCode?.toLowerCase() !== req.user.affiliateUserName?.toLowerCase()) {
                return res.status(401).json({
                    error: `UnAuthorized Request`
                });
            }
            if (!result.isPaymentProcessed) {
                result['paymentMessage'] = 'Payment will be processed 7-10 business days from the conversion date';
                result['isPaymentProcessedStatus'] = 'Not Initiated';
            } else {
                result['isPaymentProcessedStatus'] = 'Completed';
            }
            delete result.affiliateTrackUserId;
            delete result.activeProductCommissionId;
        }
        return res.json(result);
    },

    getConversionPaymentDetailsById: async function(req, res) {
        const params = req.allParams();
        const sql = `SELECT u.name, u.email, u.mobile, acp.productFinalPrice,
        acp.finalCommissionPercentage, acp.finalCommissionAmount, acp.isPaymentProcessed,
        acp.paymentReference, acp.paymentMeta, acp.comments, acp.updatedAt as acpUpdatedAt
        FROM affiliate_track_users_info aui LEFT JOIN users u on u.affiliateUserName = aui.affiliateCode
        LEFT JOIN affiliate_conversions_payment acp ON aui.id=acp.affiliateTrackUserId
        where aui.id=${params.conversionId};`;
        const result = await sails.sendNativeQuery(sql,  []);
        return res.json((result.rows && result.rows.length > 0) ? result.rows[0] : {});
    },

    getListByAffiliate: async function(req, res) {
        const params = req.allParams();
		params.limit = (params.limit && params.limit <= 50) ? params.limit : 20;
        params.pageNumber = params.pageNumber || 0;
        params.offset = params.limit * (params.pageNumber - 0);
        params.filterBy = params.filterBy ? params.filterBy : 'all';
        let whereCondition = '';
        let searchCondition = '';
        if (params.keyword) {
            params.keyword = params.keyword.replace(/'/g, '');
            searchCondition = `AND (atu.name LIKE '%${params.keyword}%' OR ap.productTitle LIKE '%${params.keyword}%')`;
        }
        if (params.filterBy === 'all') {
            whereCondition = searchCondition;
        }
        if (params.filterBy && params.filterBy === 'pending') {
            whereCondition = `AND acp.isPaymentProcessed=0 ${searchCondition}`;
        }
        if (params.filterBy && params.filterBy === 'completed') {
            whereCondition = `AND acp.isPaymentProcessed=1 ${searchCondition}`;
        }
        const sqlForTotalCount = `SELECT count(*) as total FROM affiliate_conversions_payment acp INNER JOIN affiliate_track_users_info atu ON atu.id=acp.affiliateTrackUserId LEFT JOIN affiliate_products ap ON ap.id=atu.productId where atu.affiliateCode='${req.user.affiliateUserName}' ${whereCondition}`;
        const sql = `SELECT acp.id, acp.productFinalPrice, acp.finalCommissionPercentage, acp.finalCommissionAmount, acp.isPaymentProcessed, acp.paymentReference, acp.comments, atu.name, ap.productTitle, acp.updatedAt FROM affiliate_conversions_payment acp INNER JOIN affiliate_track_users_info atu ON atu.id=acp.affiliateTrackUserId LEFT JOIN affiliate_products ap ON ap.id=atu.productId where atu.affiliateCode='${req.user.affiliateUserName}' ${whereCondition} order by acp.id desc limit ${params.offset},${params.limit}`;
        const countResult = await sails.sendNativeQuery(sqlForTotalCount,  []);
        const total = countResult.rows[0].total;
        const totalPages = Math.ceil((total / params.limit));
        const result = await sails.sendNativeQuery(sql,  []);
        return res.json({
            totalCount: total,
            hasMoreRecords: params.pageNumber < totalPages-1,
            currentPage: params.pageNumber,
            lastPage: totalPages,
            data: result.rows,
            message: `Payments will be processed in 4-7 business days`
        });
    },

    list: async function(req, res) {
        const params = req.allParams();
		params.limit = (params.limit && params.limit <= ((params.filterBy === 'pending') ? 500 : 20)) ? params.limit : ((params.filterBy === 'pending') ? 500 : 20);
        params.pageNumber = params.pageNumber || 0;
        params.offset = params.limit * (params.pageNumber - 0);
        params.filterBy = params.filterBy ? params.filterBy : 'all';
        let whereCondition = '';
        let searchCondition = '';
        if (params.keyword) {
            params.keyword = params.keyword.replace(/'/g, '');
            searchCondition = `AND (atu.name LIKE '%${params.keyword}%' OR ap.productTitle LIKE '%${params.keyword}%')`;
        }
        if (params.filterBy === 'all') {
            whereCondition = searchCondition;
        }
        if (params.filterBy && params.filterBy === 'pending') {
            whereCondition = `AND acp.isPaymentProcessed=0 ${searchCondition}`;
        }
        if (params.filterBy && params.filterBy === 'completed') {
            whereCondition = `AND acp.isPaymentProcessed=1 ${searchCondition}`;
        }
        if (params.startDate && params.endDate) {
            whereCondition = `${whereCondition} ${searchCondition} AND (acp.createdAt BETWEEN "${params.startDate}" AND "${params.endDate}")`;
        }
        const sqlForTotalCount = `SELECT count(*) as total FROM affiliate_conversions_payment acp INNER JOIN affiliate_track_users_info atu ON atu.id=acp.affiliateTrackUserId LEFT JOIN affiliate_products ap ON ap.id=atu.productId where acp.id IS NOT NULL ${whereCondition}`;
        const sql = `SELECT 
            acp.id, 
            acp.productFinalPrice, 
            acp.finalCommissionPercentage, 
            acp.finalCommissionAmount, 
            acp.isPaymentProcessed, 
            acp.paymentReference, 
            acp.comments,
            acp.createdAt as conversionDate, 
            atu.name,
            atu.email,
            atu.mobile,
            atu.affiliateStatus,
            atu.paymentStatus, 
            ap.productTitle,
            ap.productUrl,
            ap.productDescription, 
            acp.updatedAt,
            u.id as affiliateId, 
            u.name as affiliateName, 
            u.email as affiliateEmail, 
            u.mobile as affiliateMobile, 
            u.affiliateUserName,
            apf.accountName, 
            apf.accountNumber, 
            apf.accountVerified, 
            apf.ifsc, 
            apf.accountType,
            apf.profileVerified 
        FROM 
            affiliate_conversions_payment acp 
            INNER JOIN affiliate_track_users_info atu ON atu.id = acp.affiliateTrackUserId 
            LEFT JOIN affiliate_products ap ON ap.id = atu.productId 
            LEFT JOIN users u ON u.affiliateUserName = atu.affiliateCode 
            LEFT JOIN affiliate_profile apf ON apf.userId = u.id 
        where 
            acp.id IS NOT NULL ${whereCondition} 
        order by 
            acp.id desc 
        limit 
            ${params.offset}, 
            ${params.limit}`;
        const countResult = await sails.sendNativeQuery(sqlForTotalCount,  []);
        const total = countResult.rows[0].total;
        const totalPages = Math.ceil((total / params.limit));
        const result = await sails.sendNativeQuery(sql,  []);
        return res.json({
            totalCount: total,
            hasMoreRecords: params.pageNumber < totalPages-1,
            currentPage: params.pageNumber,
            lastPage: totalPages,
            data: result.rows,
            message: `Payments will be processed in 4-7 business days`
        });
    }

};

