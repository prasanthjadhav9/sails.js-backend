/**
 * AffiliateProductsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const conf = {};
const appConfig = require('rc')('sails', conf);

module.exports = {
  
    getActiveProducts: async function(req, res) {
        const currentDate = new Date();
        const result = await AffiliateProducts.find({
            statusId: 1,
            or: [
                { expiryDate: { '>': currentDate } },
                { expiryDate: null }
            ]
        }).sort('id DESC');;
        return res.json(result);
    },
    getProducts: async function(req, res) {
        const currentDate = new Date();
        const params = req.allParams();
        let whereFilter = {};
        if (params.filterBy && params.filterBy === 'expired') {
            whereFilter = {
                expiryDate: {
                    '<': currentDate
                }
            }
        }
        if (params.filterBy && params.filterBy === 'active') {
            whereFilter = {
                or: [
                    { expiryDate: { '>': currentDate } },
                    { expiryDate: null }
                ]
            }
        }
        const result = await AffiliateProducts.find({
            statusId: 1,
            ...whereFilter
        }).sort('id DESC');
        return res.json(result);
    },
    getProductsList: async function(req, res) {
        const params = req.allParams();
        const profileTypeResults = await AffiliateProfileTypes.findOne({
            userId: req.user.id,
            statusId: 1
        });
        const profileTypeId = profileTypeResults?.typeId;
        if (!profileTypeId) {
            return res.status(400).json({
                error: `Failed to fetch products`
            })
        }
        const activeWhereCond = `WHERE (ap.expiryDate > NOW() OR ap.expiryDate IS NULL) AND apc.profileTypeId = ${profileTypeId}`;

        const expiredWhereCond = `WHERE ap.expiryDate < NOW() AND apc.profileTypeId = ${profileTypeId}`;

        const defaultWhereCond = `WHERE apc.profileTypeId = ${profileTypeId}`;

        const sql = `SELECT 
            ap.id, 
            ap.productTitle, 
            ap.productDescription, 
            ap.price, 
            ap.offerPrice, 
            ap.image, 
            ap.productUrl, 
            CASE WHEN (
            apc.startDate <= NOW() 
            AND apc.endDate >= NOW()
            ) THEN apc.commissionRate ELSE NULL END AS defaultCommission, 
            CASE WHEN (
            apuc.productId IS NOT NULL 
            AND apuc.startDate <= NOW() 
            AND apuc.endDate >= NOW()
            ) THEN apuc.commissionRate ELSE NULL END AS userSpecialCommission 
        FROM 
            affiliate_products ap 
            LEFT JOIN affiliate_product_user_commission apuc ON ap.id = apuc.productId AND apuc.userId = ${req.user.id} AND apuc.statusId = 1 
            LEFT JOIN affiliate_product_commission apc ON ap.id = apc.productId AND apc.statusId=1
        ${((params.filterBy && params.filterBy === 'expired') ? (expiredWhereCond) : ((params.filterBy && params.filterBy === 'active') ? activeWhereCond : defaultWhereCond))} order by ap.id desc`;
        const result = await sails.sendNativeQuery(sql,  []);
        let processedResults = [];
        if (result.rows && result.rows.length > 0) {
            processedResults = result.rows.filter(item => item && (item.defaultCommission !== null || item.userSpecialCommission !== null));
        }
        return res.json(processedResults);
    },
    list: async function(req, res) {
        const currentDate = new Date();
        const params = req.allParams();
		params.limit = (params.limit && params.limit <= 50) ? params.limit : 20;
        params.pageNumber = params.pageNumber || 0;
        params.offset = params.limit * (params.pageNumber - 0);
        params.filterBy = params.filterBy ? params.filterBy : 'all';
        let whereCondition = {};
        let searchCondition = {};
        if (params.keyword) {
            searchCondition = {
                or: [
                  { productTitle: { contains: params.keyword } },
                  { productUrl: { contains: params.keyword } }
                ]
            }
        }
        if (params.filterBy === 'all') {
            whereCondition = {...searchCondition};
        }
        if (params.filterBy && params.filterBy === 'expired') {
            whereCondition = {
                expiryDate: {
                    '<': currentDate
                },
                ...searchCondition
            }
        }
        if (params.filterBy && params.filterBy === 'active') {
            whereCondition = {
                and: [
                    { 
                        or: [
                            { expiryDate: { '>': currentDate } },
                            { expiryDate: null }
                        ]
                    },
                    {...searchCondition}
                ]
            }
        }
        const total = await AffiliateProducts.count({
            ...whereCondition
        });
        const totalPages = Math.ceil((total / params.limit));
        let sortConditions = 'id DESC';
        if (params.sortKey) {
            sortConditions = `${params.sortKey} ${params.sortDir}`
        }
        const result = await AffiliateProducts.find({
            ...whereCondition
        }).limit(params.limit).skip(params.offset).sort(sortConditions);
        if (result && result.length > 0) {
            const activeProfileTypes = await ProfileTypes.find({
                select: ['id'],
                where: {
                    statusId: 1
                }
            });
            for (const [index, singleProduct] of result.entries()) {
                const commissionDetails = await AffiliateProductCommission.find({
                    select: ['id', 'profileTypeId', 'commissionRate', 'endDate'],
                    where: {
                        productId: singleProduct.id,
                        profileTypeId: activeProfileTypes.map(item => {
                            return item.id
                        }),
                        startDate: { '<' : currentDate},
                        or: [
                            { endDate: { '>': currentDate } },
                            { endDate: null }
                        ]
                    }
                }).populate('profileTypeId');
                if (commissionDetails) {
                    result[index]['commissionDetails'] = commissionDetails;
                }
            }
        }
        return res.json({
            totalCount: total,
            hasMoreRecords: params.pageNumber < totalPages-1,
            currentPage: params.pageNumber,
            lastPage: totalPages,
            data: result
        });
    },
    create: async function(req, res) {
        const params = req.allParams();
        try {
            const productExistResult = await sails.helpers.productExistWithUrl(params.productUrl);
            if (productExistResult.exist) {
                return res.status(409).json({
                    error: `Product is already exist with this url ${params.productUrl}`
                });
            }
            const hasDuplicateId = params.commission.some((item, index) => {
                return params.commission.findIndex(obj => obj.id === item.id) !== index;
            });
            if (hasDuplicateId) {
                return res.status(400).json({
                    error: `Invalid commission input`
                });
            }
            const createdProduct = await AffiliateProducts.create({
                productTitle: params.productTitle,
                productDescription: params.productDescription || '',
                price: params.price,
                offerPrice: params.offerPrice || null,
                image: params.image || null,
                productUrl: params.productUrl,
                expiryDate: params.expiryDate || null,
                statusId: 1,
                createdBy: req.user.id,
                updatedBy: req.user.id
            }).fetch();
            if (createdProduct && createdProduct.id) {
                if (params.commission && params.commission.length > 0) {
                    const originalDateFormatted = new Date().toISOString().split('T')[0];
                    const originalDate = new Date();
                    for(let profileType of params.commission) {
                        const foundType = await ProfileTypes.findOne({
                            id: profileType?.id,
                            statusId: 1
                        });
                        if (foundType) {
                            await AffiliateProductCommission.create({
                                productId: createdProduct.id,
                                profileTypeId: profileType?.id,
                                commissionRate: profileType?.commissionRate,
                                startDate: originalDateFormatted,
                                endDate: new Date(originalDate.getFullYear() + 100, originalDate.getMonth(), originalDate.getDate()),
                                statusId: 1,
                                createdBy: req.user.id,
                                updatedBy: req.user.id
                            });
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
                                u.statusId = 1;`;
                            const emailListResult = await sails.sendNativeQuery(getEmailListSql,  []);
                            const productDetailsObj = {
                                productTitle: createdProduct?.productTitle,
                                productDescription: createdProduct?.productDescription,
                                commission: profileType?.commissionRate
                            }
                            let emails = [];
                            if (emailListResult.rows && emailListResult.rows.length > 0) {
                                emails = emailListResult.rows.map(item => { return item.emailList });
                            }
                            processEmailsAsBatch(emails, productDetailsObj);
                        }
                    }
                    return res.json({
                        message: `Product created successfully !`
                    });
                } else {
                    return res.status(400).json({
                        error: `Product created ! Unable to assign the commission details`
                    });
                }
            } else {
                return res.status(500).json({
                    error: `Unable to create the product`
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: `Unable to create the product`
            });
        }
    },
    update: async function(req, res) {
        const params = req.allParams();
        try {
            const getProduct =  await AffiliateProducts.findOne({ id: params.productId });
            if (!getProduct) {
                return res.status(400).json({
                    error: `Product doesn't exist`
                });
            }
            await AffiliateProducts.updateOne({
                id: params.productId
            }).set({
                productTitle: params.productTitle,
                productDescription: params.productDescription || '',
                price: params.price,
                offerPrice: params.offerPrice || null,
                image: params.image || null,
                expiryDate: params.expiryDate || null,
                statusId: 1,
                updatedBy: req.user.id
            });
            return res.json({
                message: `Product has been updated successfully !`
            });
        } catch (error) {
            return res.status(500).json({
                error: `Oops ! Unable to update the product details`
            });
        }
    },
    manage: async function(req, res) {
        const params = req.allParams();
        try {
            const productData = await AffiliateProducts.findOne({
                id: params.productId
            });
            if (!productData) {
                return res.status(400).json({
                    error: `Product doesn't exist`
                });
            }
            if (params.action === 'active') {
                const productExistResult = await sails.helpers.productExistWithUrl(productData.productUrl);
                if (productExistResult.exist) {
                    return res.status(409).json({
                        error: `Product is already active with this url ${productData.productUrl}`
                    });
                }
            }
            await AffiliateProducts.updateOne({
                id: params.productId
            }).set({
                statusId: params.action === 'active' ? 1 : 0,
                updatedBy: req.user.id
            });
            return res.json({
                message: `Product successfully marked as ${params.action}`
            });
        } catch (error) {
            return res.status(500).json({
                error: `Oops ! Unable to update the product`
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
        "{{productDescription}}": productDetails?.productDescription || 'N.A',
        "{{platformLink}}": appConfig.frontEndDomain,
        "{{commission}}": productDetails?.commission,
        "{{companyName}}": appConfig.companyName
    }
    for (const batch of batches) {
        const emailTemplateResult = await sails.helpers.emailTemplates('product-notification', emailObject);
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
