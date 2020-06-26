import { connection } from "./../dBConfig";
import { STRING, INTEGER, ARRAY } from "sequelize";

import { User } from "./userModel";

export const Post = connection.define("forumpost", {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
  userId: {
    type: INTEGER,
    allowNull: false,
  },
  post: {
    type: STRING,
    allowNull: false,
  },
  postImages: {
    type: ARRAY(STRING),
  },
});

export const Comment = connection.define("forumcomment", {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: INTEGER,
    allowNull: false,
  },
  forumpostId: {
    type: INTEGER,
    allowNull: false,
  },
  comment: {
    type: STRING,
    allowNull: false,
  },
});

// Associations

Post.belongsTo(User, { onDelete: "CASCADE", onUpdate: "CASCADE" });
User.hasMany(Post, { onDelete: "CASCADE", onUpdate: "CASCADE" });

Comment.belongsTo(Post, { onDelete: "CASCADE", onUpdate: "CASCADE" });
Comment.belongsTo(User, { onDelete: "CASCADE", onUpdate: "CASCADE" });
User.hasMany(Comment, { onDelete: "CASCADE", onUpdate: "CASCADE" });
Post.hasMany(Comment, { onDelete: "CASCADE", onUpdate: "CASCADE" });

Post.addHook("beforeFind", (options) => {
  options.include = [
    { model: User, attributes: ["id", "username"] },
    {
      model: Comment,
      include: { model: User, attributes: ["id", "username"] },
    },
  ];
});
