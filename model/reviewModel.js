import { connection } from "./../dBConfig";
import { INTEGER, STRING, SMALLINT } from "sequelize";

import { User } from "./userModel";

export const Review = connection.define("reviews", {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: INTEGER,
    allowNull: false,
  },
  reviewTitle: {
    type: STRING,
    unique: true,
    allowNull: false,
    validate: {
      isReviewTitleShort(val) {
        if (val.length > 70)
          throw "Review Title Cannot be More Than 70 Letters";
      },
    },
  },
  review: {
    type: STRING(500),
    allowNull: false,
    unique: true,
  },
  rating: {
    type: SMALLINT,
    validate: {
      isratingLiesBTW1to5(val) {
        if (val < 1 || val > 5) throw "Rating Should be in between 1 to 5";
      },
    },
    defaultValue: 4,
  },
  reviewImage: {
    type: STRING,
  },
});

Review.addHook("beforeFind", (options) => {
  options.include = [{ model: User, attributes: ["id", "username"] }];
});

Review.belongsTo(User, { onDelete: "CASCADE", onUpdate: "CASCADE" });
User.hasMany(Review, { onDelete: "CASCADE", onUpdate: "CASCADE" });
