
const conf = {};
const appConfig = require('rc')('sails', conf);
const axios = require('axios');

module.exports = {
    friendlyName: 'Verify Re-Captcha Server Side',
    description: '',
    inputs: {
        token: {
            type: 'string',
            example: '03AAYGu2QpV8X3TGQ7d9ngoOpRkih2RU-vNDU_lzAe6vn25_KJie1TC',
            description: '',
            required: true
        }
    },

    exits: {

    },

    fn: async function (inputs, exits) {
        if(inputs.token)   {
            const url = `${appConfig.recaptcha.endPoint}`;
            try {
                const response = await axios.post(url, null, {
                    params: {
                        secret: appConfig.recaptcha.secretKey,
                        response: inputs.token,
                    }
                });
                console.log('Response:', response.data);
                return exits.success({
                    status: response.data.success,
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

