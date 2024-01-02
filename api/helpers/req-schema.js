module.exports = {

    friendlyName: 'Schema Validator Object',
    description: 'Return a schema validator object based on req',  
    inputs: {
      pathName: {
        type: 'string',
        example: '/users/register',
        description: 'The name of the req path.',
        required: true
      }
    },
  
    fn: async function (inputs, exits) {
      let result;
      const addressJson = {
        address1: {
          type: "string"
        },
        address2: {
          type: "string"
        },
        landmark: {
          type: "string"
        },
        city: {
          type: "string"
        },
        stateId: {
          type: "number"
        },
        pincode: {
          type: "string"
        }
      }
      inputs.pathName = inputs.pathName?.toLowerCase();
      switch(inputs.pathName) {
          case '/users/register':
              result = {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      minLength: 3,
                      maxLength: 25,
                    },
                    email: {
                      type: "string",
                      format: 'email'
                    },
                    password: {
                      type: "string",
                      format: 'strong-password'
                    },
                    reCaptchaToken: {
                      type: "string"
                    }
                  },
                  required: ["name", "email", "password", "reCaptchaToken"],
                  additionalProperties: true,
              };
              break;
          case '/users/login':
            result = {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    format: 'email'
                  },
                  password: {
                    type: "string"
                  },
                  reCaptchaToken: {
                    type: "string"
                  }
                },
                required: ["email", "password", "reCaptchaToken"],
                additionalProperties: false,
            };
            break;
          case '/users/forgot':
            result = {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  format: 'email'
                },
                reCaptchaToken: {
                  type: "string"
                }
              },
              required: ["email", "reCaptchaToken"],
              additionalProperties: false,
            };
            break;
          case '/users/resetpassword':
            result = {
              type: "object",
              properties: {
                token: {
                  type: "string",
                  minLength: 64,
                  maxLength: 64,
                },
                signature: {
                  type: "string",
                  minLength: 25
                },
                password: {
                  type: "string",
                  format: 'strong-password'
                }
              },
              required: ["token", "signature", "password"],
              additionalProperties: false,
            };
            break;
          case '/users/list':
            result = {
              type: "object",
              properties: {
                limit: {
                  type: "string",
                  maximum: 50
                },
                pageNumber: {
                  type: "string"
                },
                status: {
                  type: "string"
                },
                keyword: {
                  type: "string"
                },
                sortKey: {
                  type: "string"
                },
                sortDir: {
                  type: "string"
                }
              },
              required: [],
              additionalProperties: true,
            };
            break;
          case '/users/changepassword':
            result = {
              type: "object",
              properties: {
                oldPassword: {
                  type: "string"
                },
                newPassword: {
                  type: "string",
                  format: 'strong-password'
                }
              },
              required: ["oldPassword", "newPassword"],
              additionalProperties: false,
            }
            break;
          case '/emailverification/verify':
              result = {
                type: "object",
                properties: {
                  token: {
                    type: "string",
                    minLength: 64,
                    maxLength: 64,
                  },
                  signature: {
                    type: "string",
                    minLength: 25
                  }
                },
                required: ["token"],
                additionalProperties: true,
            };
            break;
          case '/affiliateprofile/update':
            result = {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  minLength: 3,
                  maxLength: 80
                },
                accountName: {
                  type: "string",
                  minLength: 3,
                  maxLength: 80
                },
                accountNumber: {
                  type: "string",
                  minLength: 5,
                  maxLength: 80
                },
                ifsc: {
                  type: "string",
                  minLength: 3,
                  maxLength: 15
                },
                accountType: {
                  type: "string",
                  minLength: 3,
                  maxLength: 25
                },
                panNumber: {
                  type: "string",
                  format: "pan-number"
                },
                aadhaarNumber: {
                  type: "string",
                  minLength: 12,
                  maxLength: 12
                },
                dob: {
                  type: 'string',
                  format: 'date'
                },
                gender: {
                  type: 'string',
                  enum: ['M', 'F', 'O']
                },
                website: {
                  type: 'string'
                },
                fbUrl: {
                  type: 'string'
                },
                instagramUrl: {
                  type: 'string'
                },
                twitterUrl: {
                  type: 'string'
                },
                youtubeUrl: {
                  type: 'string'
                },
                mobile: {
                  type: 'string',
                  format: 'mobile',
                  minLength: 10,
                  maxLength: 14
                },
                qualification: {
                  type: 'string',
                  maxLength: 50
                }
              },
              required: ["name", "accountName", "mobile", "accountNumber", "ifsc", "accountType", "panNumber", "aadhaarNumber", "dob", "gender"],
              additionalProperties: true,
            };
            break;
          case '/affiliateprofile/manageProfileApproval':
            result = {
              type: "object",
              properties: {
                status: {
                  type: 'string',
                  enum: ['approve', 'reject', 'hold']
                },
                rejectReason: {
                  type: 'string'
                }
              },
              required: ['status'],
              additionalProperties: false
            }
            break;
          case '/affiliateproducts/list':
            result = {
              type: "object",
              properties: {
                limit: {
                  type: "string",
                  maximum: 50
                },
                pageNumber: {
                  type: "string"
                },
                status: {
                  type: "string"
                },
                filterBy: {
                  type: "string",
                  enum: ['all', 'expired', 'active']
                },
                keyword: {
                  type: "string"
                },
                sortKey: {
                  type: "string"
                },
                sortDir: {
                  type: "string"
                }
              },
              required: [],
              additionalProperties: true,
            };
            break;
          case '/affiliateproducts/create':
            result = {
              type: "object",
              properties: {
                productTitle: {
                  type: "string",
                  minLength: 5,
                  maxLength: 200
                },
                productDescription: {
                  type: "string",
                  minLength: 5,
                  maxLength: 1000
                },
                price: {
                  type: "number",
                  minimum: 0
                },
                offerPrice: {
                  type: "number",
                  minimum: 0
                },
                image: {
                  type: "string",
                  maxLength: 200
                },
                productUrl: {
                  type: "string",
                  maxLength: 200
                },
                expiryDate: {
                  "anyOf": [
                    {
                      "type": "string",
                      "format": "date"
                    },
                    {
                      "type": "string",
                      "maxLength": 0,
                      "nullable": true
                    }
                  ]
                },
                commission: {
                  type: "array",
                  properties: {
                    id: { 
                      type: 'number' 
                    },
                    commissionRate: { 
                      type: 'number',
                      maximum: 100
                    },
                  },
                  required: ['id', 'commissionRate'],
                  additionalProperties: false
                }
              },
              required: ["productTitle", "productUrl", "price", "commission"],
              additionalProperties: true,
            };
            break;
          case '/affiliateproducts/update':
            result = {
              type: "object",
              properties: {
                productId: {
                  type: "number"
                },
                productTitle: {
                  type: "string",
                  minLength: 5,
                  maxLength: 200
                },
                productDescription: {
                  type: "string",
                  minLength: 5,
                  maxLength: 1000
                },
                price: {
                  type: "number",
                  minimum: 0
                },
                offerPrice: {
                  type: "number",
                  minimum: 0
                },
                image: {
                  type: "string",
                  maxLength: 200
                },
                expiryDate: {
                  "anyOf": [
                    {
                      "type": "string",
                      "format": "date"
                    },
                    {
                      "type": "string",
                      "maxLength": 0,
                      "nullable": true
                    }
                  ]
                }
              },
              required: ["productId", "productTitle", "price"],
              additionalProperties: true,
            };
            break;
          case '/affiliateproducts/manage':
            result = {
              type: "object",
              properties: {
                productId: {
                  type: "number"
                },
                action: {
                  type: "string",
                  enum: ['active', 'in-active']
                }
              },
              required: ["productId", "action"],
              additionalProperties: false,
            };
            break;
          /* case '/affiliateprofile/me':
            result = {
              type: "object",
              properties: {
                password: {
                  type: "string",
                  format: 'strong-password'
                }
              },
              required: ["password"],
              additionalProperties: true,
            };
            break; */
          case '/addresses/createaddress':
            result = {
              type: "object",
              properties: addressJson,
              required: ["address1", "address2", "landmark", "city", "stateId", "pincode"],
              additionalProperties: false,
            };
            break;
          case '/addresses/updateaddress':
            result = {
              type: "object",
              properties: {
                id: {
                  type: "number"
                },
                ...addressJson
              },
              required: ["id", "address1", "address2", "landmark", "city", "stateId", "pincode"],
              additionalProperties: false,
            };
            break;
          case '/addresses/markaddressdefault':
            result = {
              type: "object",
              properties: {
                id: {
                  type: "number"
                }
              },
              required: ["id"],
              additionalProperties: false,
            };
            break;
          case '/addresses/removeaddress':
            result = {
              type: "object",
              properties: {
                id: {
                  type: "number"
                }
              },
              required: ["id"],
              additionalProperties: false,
            };
            break;
          case '/affiliatetrackusersinfo/list':
            result = {
              type: "object",
              properties: {
                limit: {
                  type: "number",
                  maximum: 50
                },
                pageNumber: {
                  type: "number"
                },
                productId: {
                  type: "string"
                }
              },
              required: ["productId"],
              additionalProperties: false,
            };
            break;
          case '/affiliatetrackusersinfo/conversionslist':
            result = {
              type: "object",
              properties: {
                limit: {
                  type: "string"
                },
                pageNumber: {
                  type: "string"
                },
                keyword: {
                  type: "string"
                },
                sortKey: {
                  type: "string"
                },
                sortDir: {
                  type: "string"
                }
              },
              required: [],
              additionalProperties: true,
            };
            break;
          case '/affiliateproductcommission/update':
            result = {
              type: "object",
              properties: {
                productId: {
                  type: "number"
                },
                commission: {
                  type: "array",
                  items: {
                    type: 'object',
                    properties: {
                      id: { 
                        type: 'number' 
                      },
                      commissionRate: { 
                        type: 'number',
                        maximum: 100
                      },
                    },
                    required: ['id', 'commissionRate'],
                    additionalProperties: false
                  }            
                }
              },
              required: ["productId", "commission"],
              additionalProperties: false,
            };
            break;
          case '/affiliateprofiletypes/manageaffiliatetype':
            result = {
              type: "object",
              properties: {
                userId: {
                  type: "number"
                },
                typeId: {
                  type: "number"
                }
              },
              required: ["userId", "typeId"],
              additionalProperties: false,
            };
            break;
          case '/affiliateconversionspayment/getconversionpaymentdetails':
            result = {
              type: "object",
              properties: {
                conversionId: {
                  "anyOf": [
                    {
                      "type": "number"
                    },
                    {
                      "type": "string",
                    }
                  ]
                }
              },
              required: ["conversionId"],
              additionalProperties: false
            }
            break;
          case '/affiliateconversionspayment/getconversionpaymentdetailsbyid':
            result = {
              type: "object",
              properties: {
                conversionId: {
                  "anyOf": [
                    {
                      "type": "number"
                    },
                    {
                      "type": "string",
                    }
                  ]
                }
              },
              required: ["conversionId"],
              additionalProperties: false
            }
            break;
          case '/affiliateproductusercommission/searchuser':
            result = {
              type: "object",
              properties: {
                keyword: {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "string",
                      "maxLength": 0,
                      "nullable": true
                    }
                  ]
                },
                productId: {
                  type: "number"
                }
              },
              required: ["productId"],
              additionalProperties: false
            }
            break;
          case '/affiliateproductusercommission/getlist':
            result = {
              type: "object",
              properties: {
                productId: {
                  type: "number"
                }
              },
              required: ["productId"],
              additionalProperties: false
            }
            break;
          case '/affiliateproductusercommission/updatecommissiondetails':
            result = {
              type: "object",
              properties: {
                productId: {
                  type: "number"
                },
                userId: {
                  type: "number"
                },
                commission: {
                  type: "number"
                },
                endDate: {
                  "anyOf": [
                    {
                      "type": "string",
                      "format": "date"
                    },
                    {
                      "type": "string",
                      "maxLength": 0,
                      "nullable": true
                    }
                  ]
                },
              },
              required: ["productId", "userId", "commission"],
              additionalProperties: false
            }
            break;
          case '/affiliateproductusercommission/removeusercommission':
            result = {
              type: "object",
              properties: {
                userId: {
                  type: "number"
                },
                affiliateProductUserCommissionId: {
                  type: "number"
                }
              },
              required: ["userId", "affiliateProductUserCommissionId"],
              additionalProperties: false
            }
            break;
          case '/affiliateconversionspayment/getListbyaffiliate':
            result = {
              type: "object",
              properties: {
                limit: {
                  type: "string",
                  maximum: 50
                },
                pageNumber: {
                  type: "string"
                },
                filterBy: {
                  type: "string",
                  enum: ['all', 'pending', 'completed']
                },
                keyword: {
                  type: "string"
                },
                sortKey: {
                  type: "string"
                },
                sortDir: {
                  type: "string"
                }
              },
              required: [],
              additionalProperties: true,
            };
            break;
          case '/affiliateconversionspayment/list':
            result = {
              type: "object",
              properties: {
                limit: {
                  type: "string",
                  maximum: 50
                },
                pageNumber: {
                  type: "string"
                },
                filterBy: {
                  type: "string",
                  enum: ['all', 'pending', 'completed']
                },
                keyword: {
                  type: "string"
                },
                sortKey: {
                  type: "string"
                },
                sortDir: {
                  type: "string"
                }
              },
              required: [],
              additionalProperties: true,
            };
            break;
          default: 
              result = null;
              break;
      }
      return exits.success(result);
    }
  
};