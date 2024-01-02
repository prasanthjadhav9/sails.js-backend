/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const md5 = require('md5');
const crypto = require('crypto');
const conf = {};
const appConfig = require('rc')('sails', conf);
const jwt = require('jsonwebtoken');
const secretKey = appConfig.jwt.secret;

module.exports = {
    
    generateAffiliate: async function(req, res) {
        const result = await sails.helpers.generateAffiliateCode('Anvesh adicherla 00000120230610');
        console.log(result);
        res.json(result);
    },

    register: async function (req,res) {
        let params = req.allParams();
        console.log(`Registration request from IP:${req.ip}`);
        const hash = crypto.createHash('sha256');
        let userRecord = await Users.findOne({ email: params.email });
        if (userRecord) {
            if (userRecord && userRecord.statusId === 99) {
                return res.status(400).json({
                    error: `Your account has been deactivated ! Please contact support`
                });
            }
            return res.status(409).json({
                error: `A user account with the email address "${params.email}" already exists.`
            })
        } else {
            const emailProviderRegex = /@(gmail|yahoo|hotmail|outlook)\.(com|co\.uk|es|fr|de|it)$/i;
            const isValidProviderEmail = emailProviderRegex.test(params.email);
            if (!isValidProviderEmail) {
                const domainName = extractDomainFromEmail(params.email);
                const validateDomainResult = await sails.helpers.validateDomain(domainName);
                if (!validateDomainResult.status) {
                    return res.status(400).json({
                        error: `Sorry, the provided email domain could not be verified. Please make sure you entered a valid email address.`
                    });
                }
            }
            const affiliateUserNameResult = await sails.helpers.generateAffiliateCode(`${params.name}${new Date().getTime()}`);
            const userCreationResult = await Users.create({
                name: params.name,
                roleId: 1,
                email: params.email.toLowerCase(),
                password: md5(params.password),
                affiliateUserName: affiliateUserNameResult?.status ? affiliateUserNameResult.affiliateCode : null
            }).fetch();
            if (userCreationResult && userCreationResult.id) {
                const token = crypto.randomBytes(32).toString('hex');
                const hashedData = hash.update(token+userCreationResult.id).digest('hex');
                const url = `${appConfig.frontEndDomain}/#/verify-account?token=${token}&Signature=${hashedData}`;
                console.log(hashedData, 'HashedData', url);
                const emailObject = {
                    "{{name}}": params.name,
                    "{{verificationLink}}": url,
                    "{{companyName}}": appConfig.companyName,
                    "{{expiryTime}}": `${appConfig.email.expiryTimeInMinutes} Mins`
                };
                const emailTemplateResult = await sails.helpers.emailTemplates('verification', emailObject);
                if (emailTemplateResult.status) {
                    //params.email
                    await sails.helpers.sendEmail(params.email.toLowerCase(), emailTemplateResult.subject, emailTemplateResult.html, `Verify account using this link ${url}`);
                }
                await EmailVerification.create({
                    userId: userCreationResult.id,
                    token: token,
                    isVerified: 0
                });
                return res.json({
                    message:  `An email for verification has been sent to ${params.email}. Please check your inbox and follow the instructions to complete the sign-up process.`
                });
            } else {
                return res.status(500).json({
                    error: `Oops ! unable to process your request at this moment`
                });
            }
        }
    },
    login: async function (req,res) {
        const params = req.allParams();
        console.log(`Login request from IP:${req.ip}`);
        const hash = crypto.createHash('sha256');
        const getUser = await Users.findOne({
            email: params.email
        });
        if (!getUser) {
            return res.status(404).json({
                error: `Account doesn't exist with your email !`
            });
        }
        if (getUser && getUser.password !== md5(params.password)) {
            return res.status(400).json({
                error: `Password/UserName mismatch`
            });
        }
        if (getUser && getUser.statusId === 0 && getUser.emailVerified === 0) {
            const date = new Date();
            date.setMinutes(date.getMinutes() - appConfig.email.expiryTimeInMinutes);
            const recordExist = await EmailVerification.findOne({
                userId: getUser.id, 
                createdAt: { '>': date } 
            });
            if (recordExist) {
                return res.status(400).json({
                    error: `Please ensure to check your email inbox and complete the email verification process`
                });
            } else {
                const token = crypto.randomBytes(32).toString('hex');
                const hashedData = hash.update(token+getUser.id).digest('hex');
                const url = `${appConfig.frontEndDomain}/#/verify-account?token=${token}&Signature=${hashedData}`;
                console.log(hashedData, 'HashedData', url);
                const emailObject = {
                    "{{name}}": getUser.name,
                    "{{verificationLink}}": url,
                    "{{companyName}}": appConfig.companyName,
                    "{{expiryTime}}": `${appConfig.email.expiryTimeInMinutes} Mins`
                };
                const emailTemplateResult = await sails.helpers.emailTemplates('verification', emailObject);
                if (emailTemplateResult.status) {
                    //getUser.email
                    await sails.helpers.sendEmail(getUser.email, emailTemplateResult.subject, emailTemplateResult.html, `Verify account using this link ${url}`);
                }
                await EmailVerification.create({
                    userId: getUser.id,
                    token: token,
                    isVerified: 0
                });
                return res.status(400).json({
                    error: `An email for verification has been sent to ${params.email}. Please check your inbox and follow the instructions to complete email verification.`
                });
            }
        }
        if (getUser && getUser.statusId === 1) {
            const token = crypto.randomBytes(32).toString('hex');
            const accessToken = await AccessToken.findOne({ userId: getUser.id, roleId: getUser.roleId });
            if (accessToken) {
                await AccessToken.updateOne({
                    userId: getUser.id,
                    roleId: getUser.roleId
                }).set({
                    token: token,
                    statusId: 1
                });
            } else {
                await AccessToken.create({
                    userId: getUser.id,
                    roleId: getUser.roleId,
                    token: token,
                    statusId: 1
                });
            }
            const affiliateProfileResult = await AffiliateProfile.findOne({
                userId: getUser.id,
                profileVerified: 1
            });
            delete getUser['password'];
            return res.json({
                user: {...getUser, avatar: '', redirectProfile: affiliateProfileResult ? false : true },
                token
            });
        } else {
            return res.status(500).json({
                error: `Oops unable to process your request ! Please contact support`
            });
        }
    },
    logout: async function(req, res) {
        await AccessToken.updateOne({
            userId: req.user.id,
            roleId: req.user.roleId
        }).set({
            statusId: 0
        });
        return res.json({
            message: `You've been successfully loggedout !`
        })
    },
    forgot: async function(req, res) {
        const hash = crypto.createHash('sha256');
        const params = req.allParams();
        const getUser = await Users.findOne({
            email: params.email
        });
        if (!getUser) {
            return res.status(404).json({
                error: `Email does not found! Are you sure you are already a member?`
            });
        }
        if (getUser && getUser.statusId === 99) {
            return res.status(400).json({
                error: `Youre account is in deactivated mode ! Please contact support`
            });
        }
        const token = crypto.randomBytes(32).toString('hex');
        const hashedData = hash.update(token+getUser.id).digest('hex');
        const url = `${appConfig.frontEndDomain}/#/verify-account?token=${token}&Signature=${hashedData}&RT=fg`;
        console.log(hashedData, 'HashedData', url);
        const emailObject = {
            "{{name}}": getUser.name,
            "{{verificationLink}}": url,
            "{{companyName}}": appConfig.companyName,
            "{{expiryTime}}": `${appConfig.email.expiryTimeInMinutes} Mins`
        };
        const emailTemplateResult = await sails.helpers.emailTemplates('reset-password', emailObject);
        if (emailTemplateResult.status) {
            //getUser.email
            await sails.helpers.sendEmail(getUser.email, emailTemplateResult.subject, emailTemplateResult.html, `Verify account using this link ${url}`);
        }
        await EmailVerification.create({
            userId: getUser.id,
            token: token,
            isVerified: 0
        });
        return res.json({
            message: `Password reset sent! You'll receive an email if you are registered on our system.`
        })
    },
    resetPassword: async function(req, res) {
        const hash = crypto.createHash('sha256');
        const params = req.allParams();
        const errorData = {
            title: `Something went wrong !`,
            description: `Please ensure that you have accessed the valid link to reset your password securely.`,
            redirect: `/sign-in`
        }
        const tokenRecord = await EmailVerification.findOne({
            token: params.token
        });
        if (tokenRecord) {
            if (tokenRecord.isVerified === 98){
                return res.status(400).json({ 
                    error: `It seems that the password reset link you used has already been utilized. Please request a fresh link to proceed with resetting your password.`,
                });
            }
            const hashedData = hash.update(params.token+tokenRecord.userId).digest('hex');
            if (params.signature !== hashedData) {
                return res.status(400).json({ 
                    error: `Oops ! seems like a invalid request. Please request a new one & try again`
                });
            }
            const userData = await Users.findOne({ id: tokenRecord.userId });
            if (userData?.statusId === 99) {
                return res.status(200).json({ 
                    error: `Your account is in disable status please contact support !`,
                    data: {
                        title: `Unable to complete verification !`,
                        description: `Your account is in disable status please contact support !`,
                        redirect: `/sign-in`
                    }
                });
            }
            const tokenExpiryDate = new Date(tokenRecord.createdAt);
            tokenExpiryDate.setMinutes(tokenExpiryDate.getMinutes() + appConfig.email.expiryTimeInMinutes);
            const currentDate = new Date();
            if (currentDate.getTime() > tokenExpiryDate.getTime()) {
                await EmailVerification.update({ id: tokenRecord.id }).set({
                    isVerified: 2
                });
                return res.status(400).json({ 
                    error: `The provided password reset link has expired. Kindly request a new link to reset your password.`
                });
            }
            await Users.update({ id: tokenRecord.userId }).set({
                emailVerified: 1,
                statusId: 1,
                password: md5(params.password)
            });
            await EmailVerification.update({ id: tokenRecord.id }).set({
                isVerified: 98
            });
            return res.status(200).json({ 
                message: `Your password has been resetted successfully !`
            });
        }
        return res.status(400).json({ 
            error: `Oops ! seems like a invalid request. Please request a new one & try again`,
            data: errorData 
        });
    },
    list: async function(req, res) {
        const params = req.allParams();
		params.limit = (params.limit && params.limit <= 50) ? params.limit : 20;
        params.pageNumber = params.pageNumber || 0;
        params.offset = params.limit * (params.pageNumber - 0);
        params.keyword = params.keyword ? params.keyword.replace(/'/g, '') : '';
        const limitQuery = `limit ${params.offset},${params.limit}`;
        const statusSql = params.status ? `AND (ap.profileVerified=${params?.status} ${params.status === '0' ? 'OR ap.profileVerified IS NULL' : ''})` : '';
        const totalCountSql = `SELECT COUNT(*) as totalCount FROM users u LEFT JOIN affiliate_profile ap ON ap.userId = u.id WHERE roleId=1 AND (u.email LIKE '%${params.keyword}%' OR u.name LIKE '%${params.keyword}%') ${statusSql}`;
        const totalResult = await sails.sendNativeQuery(totalCountSql, [params.keyword,params.keyword,params.status]);
        const total = totalResult.rows[0].totalCount;
        const totalPages = Math.ceil((total / params.limit));
        let sortConditions = 'order By u.id DESC';
        if (params.sortKey) {
            sortConditions = `order By ${params.sortKey} ${params.sortDir}`
        }
        const selectColumns = `ap.id as affiliateProfileId, ap.userId,ap.accountName, ap.accountNumber,ap.accountVerified,ap.ifsc,ap.accountType,ap.panNumber,ap.panVerified,ap.aadhaarNumber, ap.aadhaarVerified,ap.kycVerified,ap.statusId,ap.rejectReason,ap.website,ap.instagramUrl,ap.fbUrl,
        ap.twitterUrl, ap.dob, ap.gender, ap.profileVerified`;
        const sql = `SELECT u.*,${selectColumns},apt.typeId FROM users u LEFT JOIN affiliate_profile ap ON ap.userId = u.id LEFT JOIN affiliate_profile_types apt ON apt.userId = u.id WHERE roleId=1 AND (u.email LIKE '%${params.keyword}%' OR u.name LIKE '%${params.keyword}%') ${statusSql} ${sortConditions} ${limitQuery}`;
        const result = await sails.sendNativeQuery(sql,  []);
        return res.json({
            totalCount: total,
            hasMoreRecords: params.pageNumber < totalPages-1,
            currentPage: params.pageNumber,
            lastPage: totalPages,
            data: result.rows
        });
    },
    listOld: async function(req, res){
		const params = req.allParams();
		params.limit = (params.limit && params.limit <= 50) ? params.limit : 20;
        params.pageNumber = params.pageNumber || 0;
        params.offset = params.limit * (params.pageNumber - 0);
        let whereCondition = {};
        if (params.keyword) {
            whereCondition = {
                or: [
                  { name: { contains: params.keyword } },
                  { email: { contains: params.keyword } }
                ]
            }
        }
        if (params.status) {
            whereCondition['statusId'] = params.status;
        }
        const total = await Users.count({
            roleId: 1,
            ...whereCondition
        });
        const totalPages = Math.ceil((total / params.limit));
        let sortConditions = 'id DESC';
        if (params.sortKey) {
            sortConditions = `${params.sortKey} ${params.sortDir}`
        }
        const result = await Users.find({
            roleId: 1,
            ...whereCondition
        }).limit(params.limit).skip(params.offset).sort(sortConditions).populateAll();
        if (result && result.length > 0) {
            const profileResult = await AffiliateProfile.find({
                userId: result.map(item => {return item?.id})
            });
            result.map(item => {
                const profileRecord = profileResult.find(prof => prof.userId === item.id);
                if (item.id && profileRecord) {
                    item['affiliateProfile'] = profileRecord;
                }
            });
        }
		return res.json({
            totalCount: total,
            hasMoreRecords: params.pageNumber < totalPages-1,
            currentPage: params.pageNumber,
            lastPage: totalPages,
            data: result
        });
	},
    changePassword: async function(req, res) {
        const params = req.allParams();
        if (req.user.password !== md5(params.oldPassword)) {
            return res.status(400).json({
                error: "Current password is mismatched. Please enter valid one"
            });
        }
        await Users.updateOne({
            id: req.user.id
        }).set({
            password: md5(params.newPassword)
        });
        return res.json({
            message: 'Your password has been changed successfully !'
        });
    },
    dashboard: async function(req, res) {
        const conversionCount = await AffiliateTrackUsersInfo.count({
            affiliateStatus: 'CONVERSION',
            affiliateCode: req.user.affiliateUserName
        });
        const leadCount = await AffiliateTrackUsersInfo.count({
            affiliateStatus: 'LEAD',
            affiliateCode: req.user.affiliateUserName
        });
        const commissionAmountSql = `SELECT ROUND(SUM(finalCommissionAmount), 2) as earnings FROM affiliate_conversions_payment acp INNER JOIN affiliate_track_users_info atui ON atui.id = acp.affiliateTrackUserId where atui.affiliateCode="${req.user.affiliateUserName}"`
        const commissionAmountNotProcessedSql = `${commissionAmountSql} AND acp.isPaymentProcessed=0`;
        const commissionAmountProcessedSql = `${commissionAmountSql} AND acp.isPaymentProcessed=1`;
        const commissionAmountSqlBefore30Days = `${commissionAmountProcessedSql} AND acp.createdAt >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`;
        const commissionAmountSqlBefore7Days = `${commissionAmountProcessedSql} AND acp.createdAt >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`;
        const commissionAmountNotProcessedResult = await sails.sendNativeQuery(commissionAmountNotProcessedSql, []);
        const commissionAmountProcessedResult = await sails.sendNativeQuery(commissionAmountProcessedSql, []);
        const commissionAmountBefore30DaysResult = await sails.sendNativeQuery(commissionAmountSqlBefore30Days, []);
        const commissionAmountBefore7DaysResult = await sails.sendNativeQuery(commissionAmountSqlBefore7Days, []);
        return res.json({
            earnings: {
                lifetime: (commissionAmountProcessedResult.rows && commissionAmountProcessedResult.rows[0]) ? commissionAmountProcessedResult.rows[0]?.earnings : 0,
                lastWeek: (commissionAmountBefore7DaysResult.rows && commissionAmountBefore7DaysResult.rows[0]) ? commissionAmountBefore7DaysResult.rows[0]?.earnings : 0,
                lastMonth: (commissionAmountBefore30DaysResult.rows && commissionAmountBefore30DaysResult.rows[0]) ? commissionAmountBefore30DaysResult.rows[0]?.earnings : 0
            },
            pending: {
                lifetime: (commissionAmountNotProcessedResult.rows && commissionAmountNotProcessedResult.rows[0]) ? commissionAmountNotProcessedResult.rows[0]?.earnings : 0,
            },
            conversions: {
                lifetime: {
                    lead: leadCount,
                    conversion: conversionCount
                }
            }
        });
    },
    adminStats: async function(req, res) {
        const currentDate = new Date();
        const unVerifiedCount = await AffiliateProfile.count({
            where: {
                profileVerified: 2
            }
        });
        const verifiedCount = await AffiliateProfile.count({
            where: {
                profileVerified: 1,
                statusId: 1
            }
        });
        const activeProductsCount = await AffiliateProducts.count({
            where: {
                statusId: 1,
                or: [
                    { expiryDate: { '>': currentDate } },
                    { expiryDate: null }
                ]
            }
        });
        return res.json({
            dashboard: {
                unVerifiedCount,
                verifiedCount,
                activeProductsCount
            }
        })
    }

};

function extractDomainFromEmail(email) {
    const regex = /@(.+)/;
    const match = email.match(regex);
    return (match && match.length > 1) ? match[1] : null;
}