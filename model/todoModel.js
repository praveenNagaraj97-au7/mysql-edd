import { STRING, DATE, INTEGER } from "sequelize";

import { connection } from "./../dBConfig";

import { isPast } from "date-fns";
import { User } from "./userModel";

export const ToDo = connection.define("todo", {
  todoTitle: {
    type: STRING,
    defaultValue: "Untitled List",
  },
  todoDescription: {
    type: STRING(400),
    allowNull: false,
  },
  whichDate: {
    type: DATE,
    validate: {
      isValPast(val) {
        if (isPast(val)) throw "ToDo Cannot Be Set to Past.";
      },
    },
    allowNull: false,
  },
  whatTime: {
    type: DATE,
    allowNull: false,
  },
  userId: {
    type: INTEGER,
  },
});

ToDo.addHook("beforeCreate", (val, options) => {});

User.hasMany(ToDo, { onDelete: "CASCADE", onUpdate: "CASCADE" });
ToDo.belongsTo(User, { onDelete: "CASCADE", onUpdate: "CASCADE" });
