const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});
require('ajv-formats')(ajv);

function buildPatternFormatter(formatNamem, pattern) {
    return ajv.addFormat(formatNamem, {
        type: 'string',
        validate: function (value) {
          // Return true if the value matches the pattern, false otherwise
          return pattern.test(value);
        },
    });
}

buildPatternFormatter('strong-password', /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+={[}\]|\\:;"'<,>.?`~])[A-Za-z\d!@#$%^&*()_+={[}\]|\\:;"'<,>.?`~]{6,16}$/);
buildPatternFormatter('website-url', /^(http(s)?:\/\/)?[a-zA-Z0-9_-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9#]+\/?)*$/);
buildPatternFormatter('fb-profile-url', /^(http(s)?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9_\-\.]+$/);
buildPatternFormatter('insta-profile-url', /^(http(s)?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_\-\.]+$/);
buildPatternFormatter('youtube-url', /^(http(s)?:\/\/)?(www\.)?youtube\.com\/(channel\/)?[a-zA-Z0-9_\-]{1,}$/);
buildPatternFormatter('twitter-url', /^(http(s)?:\/\/)?(www\.)?twitter\.com\/[a-zA-Z0-9_\-\.]+$/);
buildPatternFormatter('pan-number', /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/);
buildPatternFormatter('mobile', /^(?:[6789]\d{9})$/);

module.exports = async function (req, res, proceed) {
    const allParams = req.allParams();
    const schema = await sails.helpers.reqSchema.with({ 
        pathName: req.path
    });
    if (!schema) {
        return proceed();
    }
    const validate = ajv.compile(schema);
    const valid = validate(allParams);
    if (valid) {
        return proceed();
    } else {
        return res.status(400).json(validate.errors);   
    }
};