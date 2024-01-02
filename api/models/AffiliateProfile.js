/**
 * AffiliateProfile.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'affiliate_profile',
  attributes: {
    userId: {
      model: 'Users',
      columnName: 'userId'
    },
    referredBy: {
      model: 'Users',
      columnName: 'referredBy'
    },
    accountName: {
      type: 'string',
      columnName: 'accountName'
    },
    accountNumber: {
      type: 'number',
      columnName: 'accountNumber'
    },
    accountVerified: {
      type: 'number',
      columnName: 'accountVerified'
    },
    ifsc: {
      type: 'string',
      columnName: 'ifsc'
    },
    accountType: {
      type: 'string',
      columnName: 'accountType'
    },
    panNumber: {
      type: 'string',
      columnName: 'panNumber'
    },
    panVerified: {
      type: 'string',
      columnName: 'panVerified'
    },
    aadhaarNumber: {
      type: 'number',
      columnName: 'aadhaarNumber'
    },
    aadhaarVerified: {
      type: 'number',
      columnName: 'aadhaarVerified'
    },
    kycVerified: {
      type: 'number',
      columnName: 'kycVerified'
    },
    dob: {
      type: 'ref',
      columnName: 'dob'
    },
    gender: {
      type: 'string',
      columnName: 'gender'
    },
    website: {
      type: 'string',
      columnName: 'website'
    },
    fbUrl: {
      type: 'string',
      columnName: 'fbUrl'
    },
    instagramUrl: {
      type: 'string',
      columnName: 'instagramUrl'
    },
    twitterUrl: {
      type: 'string',
      columnName: 'twitterUrl'
    },
    youtubeUrl: {
      type: 'string',
      columnName: 'youtubeUrl'
    },
    createdBy: {
      type: 'number',
      columnName: 'createdBy'
    },
    updatedBy: {
      type: 'number',
      columnName: 'updatedBy'
    },
    statusId: {
      type: 'number',
      columnName: 'statusId'
    },
    profileVerified: {
      type: 'number',
      columnName: 'profileVerified'
    },
    rejectReason: {
      type: 'string',
      columnName: 'rejectReason',
      allowNull: true
    }
  },

};

