/**
 * UserRoles.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'user_roles',
  attributes: {
    userId: {
      model: 'Users',
      columnName: 'userId'
    },
    roleId: {
      model: 'Roles',
      columnName: 'roleId'
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
    }
  },

};

