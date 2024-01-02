/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */
const conf = {};
const appConfig = require('rc')('sails', conf);
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: appConfig.signUpRateLimitRequestsPerHour || 5, // maximum requests per windowMs
    message: async (request, response) => {
      return 'You can only make 5 requests every hour.';
    },
});

// Policy: Preventing direct search,creation,updating,destroy of records
const defaultProtectedCRUDActions = {
  find: ["protectedActions"],
  create: ["protectedActions"],
  update: ["protectedActions"],
  destroy: ["protectedActions"]
};

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  //'*': true,
  "*": ["isAuthenticated"],
  AccessTokenController: {
    ...defaultProtectedCRUDActions,
  },
  AddressesController: {
    ...defaultProtectedCRUDActions,
    createAddress: ["validateReqObj", "isAuthenticated"],
    updateAddress: ["validateReqObj", "isAuthenticated"],
    markAddressDefault: ["validateReqObj", "isAuthenticated"],
    removeAddress: ["validateReqObj", "isAuthenticated"]
  },
  AffiliateCommissionRateController: {
    ...defaultProtectedCRUDActions,
  },
  AffiliateConversionsPaymentController: {
    ...defaultProtectedCRUDActions,
    getConversionPaymentDetails: ["validateReqObj", "isAuthenticated"],
    getconversionpaymentdetailsbyid: ["validateReqObj", "isAuthenticated", "isSuperAdmin"],
    getListByAffiliate: ["validateReqObj", "isAuthenticated"],
    list: ["validateReqObj", "isAuthenticated", "isSuperAdmin"],
  },
  AffiliateProductCommissionController: {
    ...defaultProtectedCRUDActions,
    update: ["validateReqObj", "isAuthenticated", "isSuperAdmin"]
  },
  AffiliateProductsController: {
    ...defaultProtectedCRUDActions,
    getActiveProducts: ["validateReqObj", "isAuthenticated"],
    getProducts: ["validateReqObj", "isAuthenticated"],
    getProductsList: ["validateReqObj", "isAuthenticated"],
    list: ["validateReqObj", "isAuthenticated", "isSuperAdmin"],
    create: ["validateReqObj", "isAuthenticated", "isSuperAdmin"],
    update: ["validateReqObj", "isAuthenticated", "isSuperAdmin"],
    manage: ["validateReqObj", "isAuthenticated", "isSuperAdmin"],
  },
  AffiliateProductShortUrlAnalyticsController: {
    ...defaultProtectedCRUDActions,
  },
  AffiliateProductShortUrlsController: {
    ...defaultProtectedCRUDActions,
    getShortUrl: ["validateReqObj", "isAuthenticated"]
  },
  AffiliateProductUserCommissionController: {
    ...defaultProtectedCRUDActions,
    searchUser: ["validateReqObj", "isAuthenticated", "isSuperAdmin"],
    getList: ["validateReqObj", "isAuthenticated", "isSuperAdmin"],
    updateCommissionDetails: ["validateReqObj", "isAuthenticated", "isSuperAdmin"],
    removeUserCommission: ["validateReqObj", "isAuthenticated", "isSuperAdmin"]
  },
  AffiliateProfileController: {
    ...defaultProtectedCRUDActions,
    me: ["validateReqObj", "isAuthenticated"],
    manageProfileApproval: ["validateReqObj", "isAuthenticated", "isSuperAdmin"]
  },
  AffiliateProfileTypesController: {
    ...defaultProtectedCRUDActions,
    manageAffiliateType: ["validateReqObj", "isAuthenticated", "isSuperAdmin"]
  },
  AffiliateTrackUsersInfoController: {
    ...defaultProtectedCRUDActions,
    insertRecordsFromSource: true,
    list: ["validateReqObj", "isAuthenticated"],
    conversionsList: ["validateReqObj", "isAuthenticated", "isSuperAdmin"]
  },
  EmailCronController: {
    ...defaultProtectedCRUDActions,
  },
  EmailLogsController: {
    ...defaultProtectedCRUDActions,
  },
  EmailVerificationController: {
    ...defaultProtectedCRUDActions,
    verify: ["validateReqObj"],
    testMail: [true]
  },
  ProfileTypesController: {
    ...defaultProtectedCRUDActions,
    activeList: ["isAuthenticated"]
  },
  RolesController: {
    ...defaultProtectedCRUDActions,
  },
  StatesController: {
    ...defaultProtectedCRUDActions,
  },
  UserRolesController: {
    ...defaultProtectedCRUDActions,
  },
  UsersController: {
    ...defaultProtectedCRUDActions,
    register: [limiter, "validateReqObj", "verifyRecaptchaToken"],
    login: ["validateReqObj", "verifyRecaptchaToken"],
    forgot: ["validateReqObj", "verifyRecaptchaToken"],
    resetPassword: ["validateReqObj"],
    logout: ["isAuthenticated"],
    list: ["validateReqObj", "isAuthenticated", "isSuperAdmin"],
    changePassword: ["validateReqObj", "isAuthenticated"],
    adminStats: ["validateReqObj", "isAuthenticated", "isSuperAdmin"],
  },
  // LearningCalendarController: {
  //   ...defaultProtectedCRUDActions,
  // }
};
