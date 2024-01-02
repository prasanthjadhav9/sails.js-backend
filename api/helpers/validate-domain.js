
const conf = {};
const appConfig = require('rc')('sails', conf);
const dns = require('dns');

module.exports = {
    
  friendlyName: 'Checking that domain exist valid MX records or not',

  description: '',

  inputs: {
    domain: {
      type: 'string',
      example: 'example.com',
      description: '',
      required: true
    }
  },

  exits: {

  },

  fn: async function (inputs, exits) {
    if(inputs.domain)   {
        try {
            const result = await validateDomain(inputs.domain);
            return exits.success({
                status: result
            });
        } catch (error) {
            console.log('Error during domain validation', error);
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

function validateDomain(domain) {
    return new Promise((resolve, reject) => {
        dns.resolveMx(domain, (error, addresses) => {
        if (error) {
            if (error.code === 'ENOTFOUND') {
                resolve(false);
            } else {
                reject(error);
            }
        } else {
            resolve(true);
        }
        });
    });
}
