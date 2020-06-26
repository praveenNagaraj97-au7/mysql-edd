import { STRING, BIGINT, ENUM, DATE, BOOLEAN, INTEGER } from "sequelize";

import { hash, compare } from "bcryptjs";

import { connection } from "./../dBConfig";

export const User = connection.define("user", {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  username: {
    type: STRING,
    allowNull: false,
    validate: {
      isAlpha: true,
    },
  },
  email: {
    type: STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: BIGINT,
    validate: {
      isNumeric: true,
      phoneCheck(val) {
        if (!(String(val).length == 10)) throw "Enter 10 Digit Phone Number";
      },
    },
  },
  password: {
    type: STRING,
    allowNull: false,
  },
  confirmPassword: {
    type: STRING,
    allowNull: false,
    validate: {
      passwordCheck(val) {
        if (!(val === this.dataValues.password)) throw "Password Didn't Match";
      },
    },
  },
  role: {
    type: ENUM("user", "admin", "author", "event_manager", "employee"),
    defaultValue: "user",
  },
  drivingLicence: {
    type: STRING,
    validate: {
      dlcheck(val) {
        if (!(String(val).length === 13)) throw "Enter Correct Driving Licence";
      },
    },
  },
  profilePic: {
    type: STRING,
    default: "user.jpg",
  },
  gender: {
    type: ENUM("Male", "Female", "Others"),
  },
  dateOfBirth: {
    type: DATE,
  },

  passwordModified: DATE,
  bookingAccess: {
    type: BOOLEAN,
    defaultValue: false,
  },
  accountActive: {
    type: BOOLEAN,
    defaultValue: true,
  },
});

export const BookingHistory = connection.define("userbookinghistory", {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: INTEGER,
  },
  bookingId: {
    type: INTEGER,
  },
});

User.hasMany(BookingHistory, { onDelete: "CASCADE", onUpdate: "CASCADE" });
BookingHistory.belongsTo(User, { onDelete: "CASCADE", onUpdate: "CASCADE" });

export const passwordVerify = async (inputPassword, DBPassword) => {
  return await compare(inputPassword, DBPassword);
};

export const passwordHasher = async (password) => {
  return await hash(password, 12);
};

// Hooks
User.addHook("beforeCreate", async (val, options) => {
  const password = await passwordHasher(val.password);
  val.password = password;
  val.confirmPassword = "";
});
