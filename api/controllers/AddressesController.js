/**
 * AddressesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    myAddresses: async function(req, res) {
        const addressList = await Addresses.find({
            userId: req.user.id,
            statusId: 1
        }).populate('stateId');
        res.json(addressList);
    },

    createAddress: async function(req, res) {
        const params = req.allParams();
        const addressListCount = await Addresses.count({
            userId: req.user.id,
            statusId: 1
        });
        if (addressListCount >= 5) {
            return res.status(400).json({
                error: `You have reached maximum address limit. Please try to remove any existing address to add new one`
            });
        }
        try {
            await Addresses.create({
                userId: req.user.id,
                ...params,
                statusId: 1,
                createdBy: req.user.id,
                udpatedBy: req.user.id
            }).fetch();
            return res.json({
                message: `Address added successfully`
            });
        } catch (error) {
            //console.log(error);
            return res.json({
                error: `Failed to add address !`
            })
        }
    },

    updateAddress: async function(req, res) {
        const params = req.allParams();
        const addressRecord = await Addresses.findOne({
            id: params.id,
            userId: req.user.id,
            statusId: 1
        });
        if (!addressRecord) {
            return res.status(400).json({
                error: `Bad request. Address not found !`
            })
        }
        await Addresses.updateOne({
            id: params.id,
            userId: req.user.id
        }).set({
            ...params
        });
        return res.json({
            messsage: `Address updated successfully !`
        });
    },

    markAddressDefault: async function(req, res) {
        const params = req.allParams();
        const addressRecords = await Addresses.find({
            userId: req.user.id,
            statusId: 1
        });
        const recordFound = addressRecords.find(item => item.id === params.id);
        if (!recordFound) {
            return res.status(400).json({
                message: `Bad request. Address Not Found !`
            });
        }
        await Addresses.update({ userId: req.user.id, statusId: 1 }).set({ isDefault: 0 });
        await Addresses.update({ id: recordFound.id }).set({ isDefault: 1 });
        res.json({
            message: `Setting default address successfull !`
        });
    },

    removeAddress: async function(req, res) {
        const params = req.allParams();
        const addressRecord = await Addresses.findOne({
            userId: req.user.id,
            id: params.id
        });
        if (addressRecord) {
            await Addresses.updateOne({ id: addressRecord.id }).set({ statusId: 0 });
            return res.json({
                message: `Your address removed successfully !`
            });
        }
        return res.status(400).json({
            error: `Bad Request. Address Not Found !`
        });
    }

};

