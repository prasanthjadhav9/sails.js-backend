const conf = {};
const crypto = require('crypto');

module.exports = {


  friendlyName: 'Generate Affiliate Code',

  description: '',

  inputs: {
    userInfo: {
      type: 'string',
      example: 'anv324',
      description: '',
      required: true
    }
  },

  exits: {

  },

  fn: async function (inputs, exits) {
    if(inputs.userInfo)   {
      const hash = crypto.createHash('sha256').update(inputs.userInfo).digest('hex');
      const code = hash.substr(0, 8);
      return exits.success({
        status: true,
        affiliateCode: code?.toLowerCase()
      });
    }
    else {
      return exits.success({
        status: false
      });
    }
  }

};

