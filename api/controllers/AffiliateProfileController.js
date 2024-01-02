const conf = {};
const appConfig = require('rc')('sails', conf);

/**
 * AffiliateProfileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    
    createMyProfile: async function (req,res) {
        const params = req.allParams();
        return res.json({
            message: `Functionality InProgress`
        });
    },

    me: async function(req, res) {
        const params = req.allParams();
        let result;
        let roles = [];
        const user = await Users.findOne({
            id: req.user.id
        });
        if (!user) {
            return res.status(400).json({
                error: `Profile unavailable`
            });
        }
        delete user['password'];
        const profileInfo = await AffiliateProfile.findOne({
            userId: req.user.id
        });
        if (params && params.additionalDetails === 'true') {
            const attachedRoles = await AffiliateProfileTypes.find({
                userId: req.user.id,
                statusId: 1
            }).select(['id', 'typeId']).populate('typeId');
            roles = attachedRoles;
            if (attachedRoles) {
                const profileTypeIds = attachedRoles.map(item => { return item.typeId?.id });
                const commissionRates = await AffiliateCommissionRate.find({
                    profileTypeId: profileTypeIds,
                    statusId: 1,
                    startDate: {
                        '<=': new Date().toISOString().split('T')[0]
                    },
                    endDate: {
                        '>=': new Date().toISOString().split('T')[0]
                    }
                }).select(['id', 'profileTypeId', 'commissionRate']);
                attachedRoles.map(item => {
                    if (item.typeId) {
                        const foundCommissionItem = commissionRates.find(commissionItem => commissionItem.profileTypeId === item.typeId.id);
                        item.commissionDetails = foundCommissionItem;
                    }
                });
            }
        }
        if (profileInfo) {
            result = profileInfo;
        }
        let profileRedirectionObj = {
            infoMessage: '',
            redirectProfile: false
        };
        if (req.user.roleId === 1) {
            if (!profileInfo || (profileInfo && profileInfo.profileVerified === 0)) {
                profileRedirectionObj = {...profileRedirectionObj, profileVerified: !profileInfo ? 0 : profileInfo.profileVerified, redirectProfile: true, infoMessage: 'Please fill the complete profile details'};
            }
            if (profileInfo && profileInfo.profileVerified === 1) {
                profileRedirectionObj = {...profileRedirectionObj, profileVerified: profileInfo.profileVerified, infoMessage: ''};
            }
            if (profileInfo && profileInfo.profileVerified === 2) {
                profileRedirectionObj = {...profileRedirectionObj, profileVerified: profileInfo.profileVerified, infoMessage: 'Your account is under verification'};
            }
            if (profileInfo && profileInfo.profileVerified === 3) {
                profileRedirectionObj = {...profileRedirectionObj, profileVerified: profileInfo.profileVerified, forceDisable: true, infoMessage: 'Your account verification is rejected', profileAlertMessage: 'Your account verification is rejected, and updating your profile details is currently not possible'};
            }
            if (profileInfo && profileInfo.profileVerified === 4) {
                profileRedirectionObj = {...profileRedirectionObj, profileVerified: profileInfo.profileVerified, forceDisable: true, infoMessage: 'Your account verification is Temporary Hold', profileAlertMessage: 'Your account verification is Temporary Hold, and updating your profile details is currently not possible'};
            }
        }
        result = {...result,...user,...{roles},...{redirectProfile: profileRedirectionObj?.redirectProfile},...{profileVerified: profileRedirectionObj.profileVerified}, ...{profileRedirectionObj}};
        res.json(result);
    },
    
    update: async function(req, res) {
        let params = req.allParams();
        let getProfile = await AffiliateProfile.findOne({
            userId: req.user.id
        });
        if (params.mobile || params.qualification) {
            const createObj = {};
            if (params.mobile) {
                createObj['mobile'] = params.mobile;
            }
            if (params.qualification) {
                createObj['qualification'] = params.qualification;
            }
            if (params.name) {
                createObj['name'] = params.name;
            }
            await Users.updateOne({
                id: req.user.id
            }).set(createObj);
        }
        const { accountName, accountNumber, ifsc, accountType, panNumber, aadhaarNumber, dob, gender, website, fbUrl, instagramUrl, twitterUrl, youtubeUrl } = params;
        if (getProfile) {
            await AffiliateProfile.updateOne({
                userId: req.user.id
            }).set({
                accountName,
                accountNumber,
                ifsc,
                accountType,
                panNumber,
                aadhaarNumber,
                dob,
                gender,
                website,
                fbUrl,
                instagramUrl,
                twitterUrl,
                youtubeUrl,
                userId: req.user.id,
                profileVerified: 2
            });
        } else {
            await AffiliateProfile.create({
                accountName,
                accountNumber,
                ifsc,
                accountType,
                panNumber,
                aadhaarNumber,
                dob,
                gender,
                website,
                fbUrl,
                instagramUrl,
                twitterUrl,
                youtubeUrl,
                userId: req.user.id,
                profileVerified: 2
            }).fetch();
        }
        return res.json({
            message: `Profile has been ${getProfile ? 'Updated' : 'Created'} Successfully !`
        });
    },

    manageProfileApproval: async function(req, res) {
        const params = req.allParams();
        let message = '';
        const updateObj = {
            statusId: 0,
            profileVerified: 0,
            rejectReason: null
        }
        switch (params.status) {
            case 'approve':
                updateObj['statusId'] = 1;
                updateObj['profileVerified'] = 1;
                message = 'Affiliate Profile Has Been Approved ! Start Earning';
                break;
            case 'reject':
                updateObj['profileVerified'] = 3;
                updateObj['rejectReason'] = params.rejectReason;
                message = 'Affiliate Profile Has Been Rejected!';
                break;
            case 'hold':
                updateObj['profileVerified'] = 4;
                updateObj['rejectReason'] = params.rejectReason;
                message = 'Affiliate Profile Has Been Kept Hold!';
                break;
            case 'unverified':
                updateObj['profileVerified'] = 2;
                break;
            default:
                break;
        }
        const userFound = await Users.findOne({
            id: params.userId
        });
        if (!userFound) {
            return res.status(400).json({
                error: 'User Not Found'
            })
        }
        const result = await AffiliateProfile.findOne({
            userId: params.userId
        });
        if (!result) {
            return res.status(400).json({
                error: `User Doesn't Exist`
            })
        }
        await AffiliateProfile.updateOne({
            userId: result.userId
        }).set({
            ...updateObj,
            updatedBy: req.user.id
        });
        if (params.status === 'approve' || params.status === 'reject' || params.status === 'hold') {
            const emailObject = {
                "{{name}}": userFound.name,
                "{{companyName}}": appConfig.companyName
            };
            const emailTemplateResult = await sails.helpers.emailTemplates(`profile-${params.status}`, emailObject);
            if (emailTemplateResult.status) {
                await sails.helpers.sendEmail(userFound.email.toLowerCase(), emailTemplateResult.subject, emailTemplateResult.html, message, req.user.id);
            }
        }
        return res.json({
            message: `Profile ${params.status} request has been processed successfully !`
        })
    }

};

