/**
 * AffiliateProductCommission.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'affiliate_product_commission',
  attributes: {
    productId: {
      model: 'AffiliateProducts',
      columnName: 'productId'
    },
    profileTypeId: {
      model: 'ProfileTypes',
      columnName: 'profileTypeId'
    },
    commissionRate: {
      type: 'number',
      columnName: 'commissionRate'
    },
    startDate: {
      type: 'string',
      columnName: 'startDate'
    },
    endDate: {
      type: 'string',
      columnName: 'endDate'
    },
    statusId: {
      type: 'number',
      columnName: 'statusId' 
    },
    createdBy: {
      type: 'number',
      columnName: 'createdBy'
    },
    updatedBy: {
      type: 'number',
      columnName: 'updatedBy'
    }
  },

};

