
const conf = {};
const appConfig = require('rc')('sails', conf);
const axios = require('axios');

module.exports = {


  friendlyName: 'Fetch Short Url Analytics Using TinyUrl API',

  description: '',

  inputs: {
    shortUrl: {
      type: 'string',
      example: 'https://sh.com/dfd',
      description: 'Short Url',
      required: true
    },
    fromDate: {
        type: 'string',
        example: '2023-06-01 12:00:00',
        description: 'From Date String',
        required: true
    },
    interval: {
        type: 'string',
        example: 'month',
        description: ''
    }
  },

  exits: {

  },

  fn: async function (inputs, exits) {
    if(inputs.shortUrl)   {
        const queryBuilder = `api_token=${appConfig.shortUrl.tinyUrl['apiKey']}&from=${inputs.fromDate}&alias=${inputs.shortUrl}&interval=${inputs.interval || 'month'}`
        const url = `${appConfig.shortUrl.tinyUrl['apiBasePath']}/analytics/timeline?${queryBuilder}`;
        try {
            const response = await axios.get(url);
            console.log('Response:', response.data);
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

