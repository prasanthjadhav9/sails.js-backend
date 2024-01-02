
const conf = {};
const appConfig = require('rc')('sails', conf);
const axios = require('axios');

module.exports = {


  friendlyName: 'Generate Short Url Using TinyUrl API',

  description: '',

  inputs: {
    productUrl: {
      type: 'string',
      example: 'https://example.com/webinar',
      description: '',
      required: true
    },
    tags: {
      type: 'string',
      example: 'test-tag,test-tag-2',
      description: 'comma seprated tags list',
      required: false
    }
  },

  exits: {

  },

  fn: async function (inputs, exits) {
    if(inputs.productUrl)   {
        const url = `${appConfig.shortUrl.tinyUrl['apiBasePath']}/create?api_token=${appConfig.shortUrl.tinyUrl['apiKey']}`;
        const data = {
            "url": inputs.productUrl,
            "domain": appConfig.shortUrl.tinyUrl['domain'],
            "tags": inputs.tags || ''
        };
        try {
            const response = await axios.post(url, data);
            console.log('Response:', response.data);
            return exits.success({
                status: true,
                data: {
                    actualUrl: inputs.productUrl,
                    shortUrlData: response.data,
                    shortUrl: ''
                }
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

