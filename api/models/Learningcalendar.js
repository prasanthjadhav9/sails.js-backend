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
      type: 'string',
      columnName: 'date'  
  },
  url: {
    type: 'string',
    columnName: 'url'  
},
  }

};

