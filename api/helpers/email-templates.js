
const conf = {};
const appConfig = require('rc')('sails', conf);
const fs = require('fs').promises;

module.exports = {

  friendlyName: 'Returns Email Template',

  description: '',

  inputs: {
    type: {
      type: 'string',
      example: 'verification',
      description: '',
      required: true
    },
    customData: {
        type: 'ref',
        example: {
            "{{name}}": "Anvesh",
            "{{verificationLink}}": "https://test.com",
            "{{companyName}}": "Rajshekar Co",
            "{{expiryTime}}": "30 Mins"
        },
        description: '',
        required: true
    }
  },

  exits: {

  },

  fn: async function (inputs, exits) {
    let content = '';
    let subject = '';
    if(inputs.type && inputs.customData) {
        switch (inputs.type) {
            case 'verification':
                content = await fetchTemplate('assets/html-email-templates/account-verification.html', inputs.customData);
                subject = `Verify Account - Affy<${appConfig.frontEndDomain}>`;
                break;
            case 'reset-password':
                content = await fetchTemplate('assets/html-email-templates/reset-password.html', inputs.customData);
                subject = `Password Reset Request - Affy<${appConfig.frontEndDomain}>`;
              break;
            case 'profile-approve':
              content = await fetchTemplate('assets/html-email-templates/profile-approved.html', inputs.customData);
              subject = `Profile Approval Notification - Affy<${appConfig.frontEndDomain}>`;
              break;
            case 'profile-reject':
              content = await fetchTemplate('assets/html-email-templates/profile-rejected.html', inputs.customData);
              subject = `Profile Approval Notification - Affy<${appConfig.frontEndDomain}>`;
              break;
            case 'profile-hold':
              content = await fetchTemplate('assets/html-email-templates/profile-hold.html', inputs.customData);
              subject = `Profile Approval Notification - Affy<${appConfig.frontEndDomain}>`;
              break;
            case 'commission-revision':
              content = await fetchTemplate('assets/html-email-templates/commission-revision.html', inputs.customData);
              subject = `Affiliate Commission Update Notification - Affy<${appConfig.frontEndDomain}>`;
              break;
            case 'user-commission-update':
              content = await fetchTemplate('assets/html-email-templates/user-commission-update.html', inputs.customData);
              subject = `Affiliate Commission Update Notification - Affy<${appConfig.frontEndDomain}>`;
              break;
            case 'user-special-commission-assigned':
              content = await fetchTemplate('assets/html-email-templates/user-special-commission-assigned.html', inputs.customData);
              subject = `Affiliate Special Commission Update Notification - Affy<${appConfig.frontEndDomain}>`;
              break;
            case 'user-special-commission-modified':
              content = await fetchTemplate('assets/html-email-templates/user-special-commission-modified.html', inputs.customData);
              subject = `Affiliate Special Commission Update Notification - Affy<${appConfig.frontEndDomain}>`;
              break;
            case 'user-special-commission-removed':
              content = await fetchTemplate('assets/html-email-templates/user-special-commission-removed.html', inputs.customData);
              subject = `Affiliate Special Commission Update Notification - Affy<${appConfig.frontEndDomain}>`;
              break;
            case 'product-notification':
              content = await fetchTemplate('assets/html-email-templates/product-notification.html', inputs.customData);
              subject = `Exciting News! New Product Added - Start Earning Commissions Today - Affy<${appConfig.frontEndDomain}>`;
              break;
            default:
                break;
        }
        return exits.success({
            status: true,
            html: content,
            subject: subject
        });
    }
    else {
      return exits.success({
        status: false
      });
    }
  }

};

async function fetchTemplate(filePath, objectData) {
    try {
        // Read the file
        let data = await fs.readFile(filePath, 'utf-8');
        for (const key in objectData) {
          if (objectData.hasOwnProperty(key)) {
            data = data.replace(new RegExp(key, 'g'), objectData[key]);
          }
        }
        return data;
    } catch (err) {
      console.error('Error:', err);
      throw err;
    }
}