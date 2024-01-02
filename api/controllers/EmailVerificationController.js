/**
 * EmailVerificationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const conf = {};
const appConfig = require('rc')('sails', conf);
const crypto = require('crypto');

module.exports = {
    testMail: async function(req, res) {
        /* const validateDomainResult = await sails.helpers.validateDomain('yopmail.com');
        const emailProviderRegex = /@(gmail|yahoo|hotmail|outlook)\.(com|co\.uk|es|fr|de|it)$/i;
        const isValidProviderEmail = emailProviderRegex.test('test@gmail.com');
        res.json({
            isValidProviderEmail,
            validateDomainResult
        }); */
        /* const recaptcha = await sails.helpers.verifyRecaptcha('03AAYGu2QpV8X3TGQ7d9ngoOpRkih2RU-vNDU_lzAe6vn25_KJie1TCeYSlwQ_2Z2JFFgs5puXToo-AbPjRHU6beAmnvt4ri8aCtylNatYm4omkowFMaWjivNtrBjYlnYa6SlS1cb_1zXs80jg8Rwn8Ndez5_mHU_das4F8ZM9p9i7XGegt8jzxFIfVIYCqRK-dE9YLveQC_GdBGjZxYHnjnpm7vhNOfqK9LE3QXsgyfZ9HF-tVUe_u-ZUMrZQmyfRC0il3INCnwjPnMzc3j1C11OE9NUAkIr-fuW2XSpioO3eUHGwLpn83lTzx0r-nH6tx1r-OEMo_pg7fZtYJToGHhnKzjm2Xjvfbz773xTuWI9nBemJNnZcl_NNd1uTW-jkhEYGMzwjeKzBKsM4Hg88Gzx5AbunB1aANUuR7QdwAoSIA8NwSuhGfXZPKUU2u2Bbfu4xadrpLU93-ZSt934tO2HLhfg_mm3X3lTp88DG5BnRkGtfAvAMFQxROye3B-8UuKTN7hjLjDJ_k4eO7TuN6yUDuJKdpf_OknjuhKtu3WaIr4VGaQSyNNjSy3MquFaKE-5EtPV_WKH2-dsJOJprtTp3NzdInUqF081Y2q9rGadnazJ-E3foEFIZmgNqJ2RZeX_SeY3QP08QKvqIjuJiKbo1N0tU_9xFxVCwX-oo3sraoCpK9ovE4RToxwynMW5bXLLCPl3EiInTGD272FkiNNLPTmHaCWbioHEdFXOEY-uEIHKQtbO6XeJkk7sSQntyhPAzzBtlO3fJMc8gLw0SYUPebfY44k_f0XE_CMMkNByR9-CmR9VvbB7RKMGG--A1bNOaUBrwv3P1xGUedKbiEID8S7QhmnBof5PEembDeB1JV8X8BUmpvDC791nd5XwfKcyIxlWHU_k-JEpGN-ymp8lWJXLDyGEoDA02aRszmMx7pjq09eXbjWc3MhuH_l6ZRGCHPurylMDWjSPXBoC2XRiXIGH2AYIzv2tulIKTahan1oqRP1BAn4L2DIdn6eGhznnipapDQ3bhoThp8_7XYQPsPQhjR2vpHoa5_NVFFIEMd0_LH9YPMfAQeNC-Ss7eJhRO_eoeQTfANbk8g2-Qp0Kxw-_r-K99kWGBzFZfdtxbRg20xL1-UDrRdcYbum854_6urdRgYUuingdK9CjPjthORgW_qVoEQDTtIkJjMId17l6CTzWvpt7nzFkMTBmKME5PWUKDllZqx-lbrN2iS6yh16OwhzGexR_Z24xZYgasZx9deghuHbNK1h8bs8BQJuCDBNO2rSvoopegMiEO82jjWRFsIGukxEiP3yqmvaT6MVfMcyVzo50Nt5hHMr3NHwiQElX6H-6A-W5HaVdqCfoa--JNIFQlP-6bW5iY0OR-JqK4M77lhqJBtgWum0316SjDLlm5ExAWzoAoUtFzUu_zw-OieqiYM0F3yQW-T0nHongCuxtOZC6SW6tATqHCnUKcCW3RzMr0oKloubFIlcKLhnoIJSLRMBt-4njDTbfppKBaltrByLM');
        res.json(recaptcha);
        return; */
        /* const params = {
            userId: 43,
            productId: 18,
            commission: 20
        }
        const getActiveRecord = await AffiliateProductUserCommission.findOne({
            userId: params.userId,
            productId: params.productId,
            startDate: {
                '<=': new Date()
            },
            endDate: {
                '>': new Date()
            },
            statusId: 1
        }).populateAll();
        const emailParams = {
            "{{name}}": getActiveRecord.userId.name,
            "{{productName}}": getActiveRecord.productId.productTitle,
            "{{oldCommission}}": getActiveRecord.commissionRate,
            "{{commission}}": params.commission,
            "{{companyName}}": appConfig.companyName,
            "{{defaultCommission}}": 5
        };
        const sql = `SELECT 
            productId, 
            commissionRate 
        FROM 
            affiliate_product_commission apc 
            INNER JOIN affiliate_profile_types apt ON apt.typeId = apc.profileTypeId 
            AND apt.userId = ${params.userId} 
        where 
            apc.startDate <= now() 
            AND apc.endDate > now() 
            AND apc.statusId = 1 
            AND apc.productId = ${params.productId};`
        const sqlResult = await sails.sendNativeQuery(sql,  []);
        console.log(sqlResult.rows); */
        const emailObject = {
            "{{name}}": "Affiliate",
            "{{productName}}": "FullStack Developer 3 Months Course @499",
            "{{productDescription}}": "FullStack Developer Description",
            "{{platformLink}}": "https://affy.rajashekar.co",
            "{{commission}}": "90",
            "{{companyName}}": "Affy | IndStack"
        }
        const result = await sails.helpers.emailTemplates('product-notification', emailObject);
        res.send(result.html);
    },
    verify: async function (req,res) {
        const params = req.allParams();
        const hash = crypto.createHash('sha256');
        const expiredTokenData =  {
            title: `Verification Failed: Token Expired`,
            description: `Token Expired: Please login to generate a new verification token and complete the verification process`,
            redirect: `/sign-in`
        };
        const errorData = {
            title: `Something went wrong !`,
            description: `Please ensure the provided information is accurate and try again. !`,
            redirect: `/sign-in`
        }
        const tokenRecord = await EmailVerification.findOne({
            token: params.token
        });
        if (!tokenRecord) {
            return res.status(200).json({ 
                error: `Invalid Request`,
                data: errorData 
            });
        }
        const hashedData = hash.update(params.token+tokenRecord.userId).digest('hex');
        if (params.signature !== hashedData) {
            return res.status(200).json({ 
                error: `Invalid Request`,
                data: errorData
            });
        }
        if (tokenRecord.isVerified === 98){
            return res.status(200).json({ 
                error: `Already been utilized`,
                data: {
                    title: `The link already been utilized`,
                    description: `It seems that the password reset link you used has already been utilized. Please request a fresh link to proceed with resetting your password.`,
                    redirect: `/sign-in`,
                    allow: false
                }
            });
        }
        if (tokenRecord.isVerified === 1) {
            return res.json({ 
                error: `Your account is already been verified !`,
                data: {
                    title: `Verification Successfull: Already Verified`,
                    description: `Verification Successful: Account Already Verified. You can proceed to login and access your account.`,
                    redirect: `/sign-in`,
                    allow: true
                }
            });
        }
        if (tokenRecord.isVerified === 2) {
            return res.status(200).json({ 
                error: `Verification token has expired`,
                data: expiredTokenData
            });
        }
        const userData = await Users.findOne({ id: tokenRecord.userId });
        if (userData?.statusId === 99) {
            return res.status(200).json({ 
                error: `Unable to verify`,
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
            return res.status(200).json({ 
                error: 'Verification token has expired',
                data: expiredTokenData
            });
        }
        await EmailVerification.update({ id: tokenRecord.id }).set({
            isVerified: 1
        });
        await Users.update({ id: tokenRecord.userId }).set({
            emailVerified: 1,
            statusId: 1
        });
        return res.json({
            message: `Email verified successfully !`,
            data: {
                title: `Verification Successfull !`,
                description: `Congratulations! Your account verification was successful. You can now continue with the sign-in process to access all the features and services of our platform. We are excited to have you on board!`,
                redirect: `/sign-in`,
                allow: true
            }
        });
    }

};