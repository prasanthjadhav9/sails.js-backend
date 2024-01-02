/**
 * AffiliateTrackUsersInfo.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'affiliate_track_users_info',
  attributes: {
    name: {
      type: 'string',
      columnName: 'name',
      allowNull: true
    },
    email: {
      type: 'string',
      columnName: 'email'
    },
    mobile: {
      type: 'string',
      columnName: 'mobile',
      allowNull: true
    },
    affiliateCode: {
      type: 'string',
      columnName: 'affiliateCode',
      allowNull: true
    },
    tempUserId: {
      type: 'string',
      columnName: 'tempUserId',
      allowNull: true
    },
    paymentStatus: {
      type: 'string',
      columnName: 'paymentStatus',
      allowNull: true
    },
    affiliateStatus: {
      type: 'string',
      columnName: 'affiliateStatus',
      allowNull: true
    },
    productId: {
      model: 'AffiliateProducts',
      columnName: 'productId'
    },
    updatedByInfoMeta: {
      type: 'ref',
      columnName: 'updatedByInfoMeta'
    },
    duplicateRequestCount: {
      type: 'number',
      columnName: 'duplicateRequestCount'
    }
  },

};

