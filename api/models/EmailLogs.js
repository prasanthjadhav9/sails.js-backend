/**
 * EmailLogs.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */


module.exports = {

  tableName: 'email_logs',
  attributes: {
    emailAddress: {
      type: 'string',
      columnName: 'emailAddress'
    },
    subject: {
      type: 'string',
      columnName: 'subject'
    },
    emailBody: {
      type: 'string',
      columnName: 'emailBody'
    },
    sentFromEmail: {
      type: 'string',
      columnName: 'sentFromEmail'
    },
    sentBy: {
      type: 'number',
      columnName: 'sentBy'
    },
    sentOn: {
      type: 'string',
      columnName: 'sentOn'
    }
  },

};