/**
 * AffiliateProfileTypesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    manageAffiliateType: async function(req, res) {
        const params = req.allParams();
        const checkRecord = await ProfileTypes.findOne({
            id: params.typeId,
            statusId: 1
        });
        if (checkRecord) {
            const checkProfileTypeRecord = await AffiliateProfileTypes.findOne({
                userId: params.userId
            });
            if (checkProfileTypeRecord) {
                await AffiliateProfileTypes.updateOne({
                    id: checkProfileTypeRecord.id
                }).set({
                    typeId: params.typeId,
                    statusId: 1,
                    updatedBy: req.user.id
                });
            } else {
                await AffiliateProfileTypes.create({
                    userId: params.userId,
                    typeId: params.typeId,
                    statusId: 1,
                    createdBy: req.user.id,
                    updatedBy: req.user.id
                });
            }
            return res.json({
                message: `Request processed sucessfully !`
            })
        } else {
            return res.status(400).json({
                error: `Choosen ProfileType Doesn't exist`
            })
        }
    }

};

