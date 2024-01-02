module.exports = async function (req, res, proceed) {
    const params = req.allParams();
    const recaptcha = await sails.helpers.verifyRecaptcha(params.reCaptchaToken);
    if (!recaptcha || !recaptcha.status) {
        return res.status(400).json({
            error: `Sorry, the request appears to be from a bot and cannot be processed at the moment.`
        });
    } else if(recaptcha.status) {
        return proceed();
    } else {
        return res.forbidden();
    }
};