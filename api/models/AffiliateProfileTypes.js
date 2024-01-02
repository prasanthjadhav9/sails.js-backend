/**
 * AffiliateProfileTypes.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'affiliate_profile_types',
  attributes: {
    userId: {
      model: 'Users',
      columnName: 'userId'
    },
    typeId: {
      model: 'ProfileTypes',
      columnName: 'typeId'
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

