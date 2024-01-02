const conf = {};
const appConfig = require('rc')('sails', conf);

module.exports = {


  friendlyName: 'Is valid access token',

  description: '',

  inputs: {
    accessToken: {
      type: 'string',
      example: '29b81e7ed500f5143b32b95167d42791',
      description: 'Access token sent by user through headers',
      required: true
    },
    userId: {
      type: 'string',
      example: '1',
      description: 'UserId sent by user through headers',
      required: true
    }
  },

  exits: {

  },

  fn: async function (inputs, exits) {
    if(inputs.accessToken && inputs.userId)   {
      const fetchAccessTokenRecord = await AccessToken.findOne({
        userId: inputs.userId,
        token: inputs.accessToken,
        statusId: 1
      }).populate('userId');
      return exits.success({
        status: Boolean(fetchAccessTokenRecord),
        user: fetchAccessTokenRecord ? fetchAccessTokenRecord.userId : null
      });
    }
    else {
      return exits.success({
        status: false
      });
    }
  }

};

