module.exports = async function (req, res, proceed) {
    const token = req.headers['x-auth-token'];
    const userId = req.headers['x-requester'];
    if(!token || !userId) {
      return res.forbidden();
    }
    const accessToken = await sails.helpers.isValidAccessToken(token, userId);
    req.user = accessToken.user;
    if (accessToken.status) {
      return proceed();
    }
    return res.forbidden();
};