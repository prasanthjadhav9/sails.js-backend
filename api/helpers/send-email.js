
const conf = {};
const appConfig = require('rc')('sails', conf);
const axios = require('axios');

module.exports = {


  friendlyName: 'Send Email to User',

  description: '',

  inputs: {
    to: {
        type: 'string',
        example: 'anvesh@indstack.com',
        description: '',
        required: true
    },
    subject: {
        type: 'string',
        example: "Email Subject",
        description: '',
        required: true
    },
    htmlDescription: {
        type: 'string',
        example: "Email Description",
        description: '',
        required: true
    },
    textDescription: {
        type: 'string',
        example: "Text Description",
        description: '',
        required: true
    },
    sentBy: {
        type: 'number',
        example: 1,
        description: '',
        required: false
    }
  },

  exits: {

  },

  fn: async function (inputs, exits) {
    if(inputs.to && inputs.subject && inputs.htmlDescription && inputs.textDescription)   {
        const url = `${appConfig.sms.lambda['apiBasePath']}/email/send`;
        try { 
            const response = await axios.post(url, {
                to: inputs.to,
                from: appConfig.sms.lambda['fromList']['verification'],
                emailContent: {
                    subject: inputs.subject,
                    html: inputs.htmlDescription,
                    text: inputs.textDescription || 'SAMPLE_SUBJECT'
                }
            });
            await EmailLogs.create({
                emailAddress: inputs.to,
                subject: inputs.subject,
                emailBody: inputs.htmlDescription || inputs.textDescription,
                sentFromEmail: appConfig.sms.lambda['fromList']['verification'],
                sentBy: inputs.sentBy || 0
            });
            console.log('Email Response:', response.data);
            return exits.success({
                status: true,
                data: response.data
            });
        } catch (error) {
            console.error('Error:', error);
            return exits.success({
                status: false
            });
        }
    }
    else {
      return exits.success({
        status: false
      });
    }
  }

};

