import slugify from "slugify";

import { connection } from "./../dBConfig";

import {
  STRING,
  INTEGER,
  BOOLEAN,
  BIGINT,
  DOUBLE,
  FLOAT,
  ARRAY,
} from "sequelize";

export const Shop = connection.define("shop", {
  id: {
    type: INTEGER,
    primaryKey: true,

    autoIncrement: true,
  },
  partName: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
  slug: {
    type: STRING,
  },
  partPrice: {
    type: DOUBLE,
    allowNull: false,
  },
  productCategory: {
    type: STRING,
    allowNull: false,
  },
  carBrand: {
    type: STRING,
    allowNull: false,
  },
  carModel: {
    type: STRING,
    allowNull: false,
  },
  carVarient: {
    type: FLOAT,
    allowNull: false,
  },
  productBy: {
    type: STRING,
    allowNull: false,
  },
  productQuality: {
    type: STRING,
    allowNull: false,
  },
  productQuantity: {
    type: INTEGER,
    allowNull: false,
  },
  productImages: {
    type: ARRAY(STRING),
  },
  productDetails: {
    type: STRING,
  },
  productPartNumber: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
});

Shop.addHook("beforeCreate", (shop, options) => {
  shop.slug = slugify(shop.partName);
});
