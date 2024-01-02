module.exports = {


  friendlyName: 'Product exist with url',

  description: '',

  inputs: {
    productUrl: {
      type: 'string',
      example: 'https://test.com/test/',
      description: 'Product Url',
      required: true
    }
  },

  exits: {

  },

  fn: async function (inputs, exits) {
    if(inputs.productUrl)   {
        const existingProductWithUrl = await AffiliateProducts.findOne({
            where: { 
                productUrl: { contains: inputs.productUrl },
                statusId: 1
            },
        });
        if (existingProductWithUrl) {
            const url = new URL(inputs.productUrl);
            let domainPath = url.hostname + url.pathname;
            if (domainPath.endsWith('/')) {
                domainPath = domainPath.slice(0, -1);
            }
            const productUrl = new URL(existingProductWithUrl.productUrl);
            let productDomainPath = productUrl.hostname + productUrl.pathname;
            if (productDomainPath.endsWith('/')) {
                productDomainPath = productDomainPath.slice(0, -1);
            }
            if (domainPath === productDomainPath) {
                return exits.success({
                    exist: true,
                    data: existingProductWithUrl
                });
            }
        }
        else {
            return exits.success({
                exist: false,
                data: existingProductWithUrl
            });
        }
    }
    else {
        return exits.success({
            exist: false
        });
    }
  }

};

