module.exports = async function (req, res, proceed) {
    if (req.user && req.user.roleId === 3) {
      return proceed();
    }
    return res.forbidden();
};