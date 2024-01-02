/**
 * Users.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'users',
  attributes: {
    name: {
      type: 'string',
      columnName: 'name'
    },
    email: {
      type: 'string',
      columnName: 'email'
    },
    emailVerified: {
      type: 'number',
      columnName: 'emailVerified'
    },
    mobile: {
      type: 'string',
      columnName: 'mobile'
    },
    countryCode: {
      type: 'number',
      columnName: 'countryCode'
    },
    password: {
      type: 'string',
      columnName: 'password'
    },
    qualification: {
      type: 'string',
      columnName: 'qualification'
    },
    address: {
      type: 'string',
      columnName: 'address'
    },
    affiliateUserName: {
      type: 'string',
      columnName: 'affiliateUserName',
      unique: true
    },
    /* 1-Affliater 3-Admin */
    roleId: {
      type: 'number',
      columnName: 'roleId'
    },
    /* 1-Active, 0-InActive, 99-Deactivated  */
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
  customToJSON: function() {    
      return _.omit(this, ['password']);
  }
};

