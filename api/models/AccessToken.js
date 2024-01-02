/**
 * AccessToken.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'access_token',
  attributes: {
    userId: {
      model: 'Users',
      columnName: 'userId'
    },
    roleId: {
      model: 'Roles',
      columnName: 'roleId'
    },
    token: {
      type: 'string',
      columnName: 'token'
    },
    statusId: {
      type: 'number',
      columnName: 'statusId'
    }
  },

};

