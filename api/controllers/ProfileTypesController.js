/**
 * ProfileTypesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    activeList: async function(req, res) {
        const result = await ProfileTypes.find({
            select: ['id', 'profileType'],
            where: {
                statusId: 1
            }
        });
        return res.json(result);
    }

};

