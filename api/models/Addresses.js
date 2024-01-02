/**
 * Addresses.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'addresses',
  attributes: {
    userId: {
      model: 'Users',
      columnName: 'userId'
    },
    address1: {
      type: 'string',
      columnName: 'address1'
    },
    address2: {
      type: 'string',
      columnName: 'address2'
    },
    landmark: {
      type: 'string',
      columnName: 'landmark'
    },
    city: {
      type: 'string',
      columnName: 'city'
    },
    stateId: {
      model: 'States',
      columnName: 'stateId'
    },
    pincode: {
      type: 'string',
      columnName: 'pincode'
    },
    isDefault: {
      type: 'number',
      columnName: 'isDefault'
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

