import slugify from "slugify";
import validator from "validator";

import {
  STRING,
  UUID,
  UUIDV4,
  INTEGER,
  BIGINT,
  DOUBLE,
  BOOLEAN,
  ENUM,
  ARRAY,
  Op,
} from "sequelize";

import { connection } from "./../dBConfig";

export const Car = connection.define("car", {
  // id: {
  //   type: UUID,
  //   defaultValue: UUIDV4,
  //   primaryKey: true,
  // },
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  slug: {
    type: STRING,
  },
  carname: {
    type: STRING,
    allowNull: false,
    unique: true,
  },

  price: {
    type: BIGINT,
    allowNull: false,
  },
  doors: {
    type: INTEGER,
    allowNull: false,
  },
  seats: {
    type: INTEGER,
    allowNull: false,
  },
  transmission: {
    type: ENUM,
    values: ["Manual", "Auto"],
    allowNull: false,
  },
  min_age: {
    type: INTEGER,
    allowNull: false,
  },
  carCoverImage: {
    type: STRING,
  },
  luggage: {
    type: STRING,
    allowNull: false,
  },
  fuelType: {
    type: STRING,
    allowNull: false,
  },
  fuelEconomy: {
    type: DOUBLE,
    allowNull: false,
  },
  engine: {
    type: DOUBLE,
    allowNull: false,
  },
  horsepower: {
    type: DOUBLE,
    allowNull: false,
  },
  carType: {
    type: STRING,
    allowNull: false,
  },

  condition: {
    type: BOOLEAN,
    defaultValue: true,
  },
});

export const AttachCar = connection.define("attachCar", {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  carImages: {
    type: ARRAY(STRING),
  },
  numberPlate: {
    type: STRING,
    allowNull: false,
    unique: true,
    validate: {
      isUppercase: true,
    },
  },
  modelYear: {
    type: INTEGER,
    defaultValue: 2020,
  },
  availableLocation: {
    type: ENUM(
      "Kormangala",
      "Indiranagar",
      "Jaynagar",
      "Yelahanka",
      "RT Nagar"
    ),
    allowNull: false,
  },
  colour: {
    type: STRING,
    allowNull: false,
  },
  carId: {
    type: INTEGER,
  },
  available: {
    type: BOOLEAN,
    default: true,
  },
});

// Hooks
Car.addHook("beforeCreate", (val, options) => {
  val.slug = slugify(val.carname);
  val.price = Math.floor(val.price);
  val.min_age = Math.floor(val.min_age);
});

// Creating Relations
Car.hasMany(AttachCar, { onDelete: "CASCADE", onUpdate: "CASCADE" });
AttachCar.belongsTo(Car, { onDelete: "CASCADE", onUpdate: "CASCADE" });

Car.addHook("beforeFind", (options) => {
  options.include = [{ model: AttachCar }];
});
