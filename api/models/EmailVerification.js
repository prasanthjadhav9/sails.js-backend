/**
 * EmailVerification.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'email_verification',
  attributes: {

    userId: {
      model: 'Users',
      columnName: 'userId'
    },
    token: {
      type: 'string',
      columnName: 'token'
    },
    /* 0-NotVerified, 1-Verified, 2-Expired, 98-ResetLink already been utilized */
    isVerified: {
      type: 'number',
      columnName: 'isVerified'
    }

  },

};
