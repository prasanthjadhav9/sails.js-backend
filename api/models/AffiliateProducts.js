/**
 * AffiliateProducts.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'affiliate_products',
  attributes: {
    productTitle: {
      type: 'string',
      columnName: 'productTitle'
    },
    productDescription: {
      type: 'string',
      columnName: 'productDescription',
      allowNull: true
    },
    price: {
      type: 'number',
      columnName: 'price',
      allowNull: true
    },
    offerPrice: {
      type: 'number',
      columnName: 'offerPrice',
      allowNull: true
    },
    image: {
      type: 'string',
      columnName: 'image',
      allowNull: true
    },
    productUrl: {
      type: 'string',
      columnName: 'productUrl'
    },
    expiryDate: {
      type: 'ref',
      columnName: 'expiryDate'
    },
    statusId: {
      type: 'number',
      columnName: 'statusId'
    },
    createdBy: {
      model: 'Users',
      columnName: 'createdBy'
    },
    updatedBy: {
      model: 'Users',
      columnName: 'updatedBy'
    },
  },

};

