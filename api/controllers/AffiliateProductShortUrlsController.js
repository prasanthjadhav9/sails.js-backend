/**
 * AffiliateProductShortUrlsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    
    getShortUrl: async function (req,res) {
        const params = req.allParams();
        const getShortUrlRecord = await AffiliateProductShortUrls.findOne({
            productId: params.productId,
            userId: req.user.id
        });
        if (getShortUrlRecord) {
            return res.json({
                url: getShortUrlRecord.shortUrl
            });
        } else {
            const productRecord = await AffiliateProducts.findOne({
                id: params.productId,
                statusId: 1
            });
            if (!productRecord) {
                return res.status(400).json({
                    error: `Bad Request! Affiliate Product Not Found.`
                });
            }
            let affiliateUrl = '';
            affiliateUrl = `${productRecord.productUrl}${productRecord.productUrl.includes('?') ? '&' : '?'}affiliateID=${req.user.affiliateUserName}`;
            const shortUrlResponse = await sails.helpers.generateShortUrl(affiliateUrl, req.user.affiliateUserName);
            if (shortUrlResponse.status) {
                try {
                    await AffiliateProductShortUrls.create({
                        productId: params.productId,
                        shortUrl: shortUrlResponse.data.shortUrlData.data.tiny_url,
                        userId: req.user.id,
                        statusId: 1
                    }).fetch();
                    return res.json({
                        url: shortUrlResponse.data.shortUrlData.data.tiny_url
                    })
                } catch (error) {
                    return res.status(400).json({
                        error: `Oops ! Unable to generate affiliate url`
                    })
                }
            } else {
                return res.status(400).json({
                    error: `Oops ! Unable to generate affiliate url`
                })
            }
        }
    }

};

