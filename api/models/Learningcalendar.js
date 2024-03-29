/**
 * Learningcalendar.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'learningcalendar',
  attributes: {
    day: {
      type: 'string',
      columnName: 'day'
    },
    date: {
      type: 'ref',
      // allowNull: true,
      columnName: 'date'
    },
    url: {
      type: 'string',
      columnName: 'url'
    },
    topic: {
      type: 'string',
      columnName: 'topic'
    },
    // id:{
    //   type:'number',
    //   columnName:'id'
    // }
  }
};


