/**
 * Roles.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'roles',
  attributes: {
    roleName: {
      type: 'string',
      columnName: 'roleName'
    },
    roleDescription: {
      type: 'string',
      columnName: 'roleDescription'
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

