/**
 * AffiliateConversionsPayment.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'affiliate_conversions_payment',
  attributes: {
    affiliateTrackUserId: {
      model: 'AffiliateTrackUsersInfo',
      columnName: 'affiliateTrackUserId'
    },
    activeProductCommissionId: {
      model: 'AffiliateProductCommission',
      columnName: 'activeProductCommissionId'
    },
    activeProductUserCommissionId	: {
      type: 'number',
      columnName: 'activeProductUserCommissionId'
    },
    productFinalPrice: {
      type: 'number',
      columnName: 'productFinalPrice'
    },
    finalCommissionPercentage: {
      type: 'number',
      columnName: '	finalCommissionPercentage'
    },
    finalCommissionAmount: {
      type: 'number',
      columnName: 'finalCommissionAmount'
    },
    isPaymentProcessed: {
      type: 'number',
      columnName: 'isPaymentProcessed'
    },
    paymentReference: {
      type: 'string',
      columnName: 'paymentReference'
    },
    paymentMeta: {
      type: 'ref',
      columnName: 'paymentMeta'
    },
    comments: {
      type: 'string',
      columnName: 'comments'
    },
    updatedBy: {
      type: 'number',
      columnName: 'updatedBy'
    }
  },

};

