/**
 * ProfileTypes.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'profile_types',
  attributes: {
    profileType: {
      type: 'string',
      columnName: 'profileType'
    },
    statusId: {
      type: 'number',
      columnName: 'statusId'
    }
  },

};

