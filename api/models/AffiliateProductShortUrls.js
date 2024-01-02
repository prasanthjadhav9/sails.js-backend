/**
 * AffiliateProductShortUrls.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  
  tableName: 'affiliate_product_short_urls',
  attributes: {
    productId: {
      model: 'AffiliateProducts',
      columnName: 'productId'
    },
    shortUrl: {
      type: 'string',
      columnName: 'shortUrl'
    },
    userId: {
      model: 'Users',
      columnName: 'userId'
    },
    statusId: {
      type: 'number',
      columnName: 'statusId'
    }
  },

};

