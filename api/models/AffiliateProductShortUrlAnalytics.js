/**
 * AffiliateProductShortUrlAnalytics.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'affiliate_product_short_url_analytics',
  attributes: {
    productShortUrlId: {
      model: 'AffiliateProductShortUrls',
      columnName: 'productShortUrlId'
    },
    date: {
      type: 'string',
      columnName: 'date'
    },
    totalCount: {
      type: 'number',
      columnName: 'totalCount'
    },
    uniqueCount: {
      type: 'number',
      columnName: 'uniqueCount'
    },
    humanCount: {
      type: 'number',
      columnName: 'humanCount'
    },
    statusId: {
      type: 'number',
      columnName: 'statusId'
    }
  },

};

