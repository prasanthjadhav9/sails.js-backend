/**
 * Tasks.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'tasks',
  attributes: {
    taskname: {
      type: 'string',
      columnName: 'taskname'
    },
  },

};

