/**
 * States.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'states',
  attributes: {
    stateName: {
      type: 'string',
      columnName: 'stateName'
    },
    statusId: {
      type: 'number',
      columnName: 'statusId'
    }
  },

};

