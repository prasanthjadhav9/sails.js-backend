/**
 * AffiliateTrackUsersInfoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    
    /*
        "Body" 
        {
        "source": "convertKit"
        "records": [
            {
                "name": "test",
                "email": "test@gmail.com",
                "affiliateID": "tesdki324",
                "tempUserId": "sdfdsjf",
                "sourcePathName": "https://rajasekhar.co/full-stack-webinar-paid?affiliateID=2343924839"
            },
            {
                "name": "test",
                "email": "test@gmail.com",
                "affiliateID": "tesdki324",
                "tempUserId": "sdfdsjf",
                "sourcePathName": "https://rajasekhar.co/full-stack-webinar-paid?affiliateID=234983472"
            }
        ]
    }
    */
    insertRecordsFromSource: async function(req, res) {
        const params = req.allParams();
        let response = [];
        if (!params.records || params.records.length === 0) {
            return res.status(400).json({
                message: `Invalid Request`
            });
        }
        for(let eachRecord of params.records) {
            const url = removeQueryParams(eachRecord.sourcePathName);
            const productInfo = await AffiliateProducts.findOne({ 
                productUrl: {
                    like: `%${url}%`
                }
            });
            const recordExist = await AffiliateTrackUsersInfo.findOne({
                email: eachRecord.email,
                productId: productInfo?.id
            });
            if (recordExist) {
                await AffiliateTrackUsersInfo.updateOne({
                    id: recordExist.id
                }).set({
                    duplicateRequestCount: recordExist.duplicateRequestCount+1
                });
                response.push({
                    [eachRecord.tempUserId]: 'Record alredy exist. Unable to process'
                });
            } else {
                await AffiliateTrackUsersInfo.create({
                    name: eachRecord.name || null,
                    email: eachRecord.email || null,
                    mobile: eachRecord.mobile || null,
                    affiliateCode: eachRecord.tempUserId || null,
                    tempUserId: eachRecord.tempUserId || null,
                    paymentStatus: 'PENDING',
                    affiliateStatus: 'LEAD',
                    productId: productInfo.id || null,
                    updatedByInfoMeta: JSON.stringify([
                        {
                            reqDate: new Date(),
                            source: params?.source
                        }
                    ])
                }).fetch();
                response.push({
                    [eachRecord.tempUserId]: 'Record Processed Sucessfully'
                });
            }
        }
        return res.json({
            message: 'Request Processed Succesfully !',
            data: response
        });
    },
    list: async function(req, res) {
        let analytics = {
            rows: [{
                "productShortUrlId": null,
                "totalCountSum": null,
                "uniqueCountSum": null,
                "humanCountSum": null
            }]
        };
        const params = req.allParams();
        params.limit = (params.limit && params.limit <= 50) ? params.limit : 20;
        params.pageNumber = params.pageNumber || 1;
        params.offset = params.limit * (params.pageNumber - 1);
        const results = await AffiliateTrackUsersInfo.find({
            productId: params.productId,
            affiliateCode: req.user.affiliateUserName
        }).limit(params.limit).skip(params.offset).sort('id DESC');
        const maskedResults = results.map(obj => {
            const { email, mobile, ...rest } = obj;
            const maskedEmail = email.replace(/(?<=.{3}).(?=[^@]*?@)|(?<=@.).(?=.*?\.)/g, '*'); // Mask email
            const maskedMobile = mobile.replace(/(?<=\d{3})\d(?=\d{4})/g, '*'); // Mask mobile number
            obj.updatedByInfoMeta = null;
            return {
                ...rest, // Spread the rest of the properties
                email: maskedEmail,
                mobile: maskedMobile
            };
        });
        const productShortUrlId = await AffiliateProductShortUrls.findOne({
            productId: params.productId,
            userId: req.user.id
        });
        if (productShortUrlId) {
            const sql = `SELECT productShortUrlId, SUM(totalCount) totalCountSum, SUM(uniqueCount) uniqueCountSum, SUM(humanCount) humanCountSum from affiliate_product_short_url_analytics where productShortUrlId=${productShortUrlId?.id};`
            analytics = await sails.sendNativeQuery(sql,  []);
        }
        return res.json({
            list: maskedResults,
            analytics: analytics.rows
        });
    },
    conversionsList: async function(req, res) {
        const params = req.allParams();
		params.limit = (params.limit && params.limit <= 50) ? params.limit : 20;
        params.pageNumber = params.pageNumber || 0;
        params.offset = params.limit * (params.pageNumber - 0);
        let whereCondition = {};
        if (params.keyword) {
            whereCondition = {
                or: [
                  { name: { contains: params.keyword } },
                  { email: { contains: params.keyword } },
                  { mobile: { contains: params.keyword } },
                  { affiliateCode: { contains: params.keyword }}
                ]
            }
        }
        const total = await AffiliateTrackUsersInfo.count({
            ...whereCondition
        });
        const totalPages = Math.ceil((total / params.limit));
        let sortConditions = 'id DESC';
        if (params.sortKey) {
            sortConditions = `${params.sortKey} ${params.sortDir}`
        }
        const result = await AffiliateTrackUsersInfo.find({
            ...whereCondition
        }).limit(params.limit).skip(params.offset).sort(sortConditions).populate('productId');
        return res.json({
            totalCount: total,
            hasMoreRecords: params.pageNumber < totalPages-1,
            currentPage: params.pageNumber,
            lastPage: totalPages,
            data: result
        });
    }

};

function removeQueryParams(urlString) {
    const url = new URL(urlString);
    url.search = '';
    return url.toString();
}