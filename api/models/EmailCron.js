/**
 * EmailCron.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'email_cron',
  attributes: {
    toEmail: {
      type: 'string',
      columnName: 'toEmail'
    },
    fromEmail: {
      type: 'string',
      columnName: 'fromEmail'
    },
    bcc: {
      type: 'string',
      columnName: 'bcc'
    },
    subject: {
      type: 'string',
      columnName: 'subject'
    },
    emailBody: {
      type: 'string',
      columnName: 'emailBody'
    },
    isHtmlBody: {
      type: 'number',
      columnName: 'isHtmlBody'
    },
    isRequestProcessed: {
      type: 'number',
      columnName: 'isRequestProcessed'
    },
    scheduleDateTime: {
      type: 'string',
      columnName: 'scheduleDateTime'
    },
    emailResponse: {
      type: 'ref',
      columnName: 'emailResponse'
    }
  },

};

