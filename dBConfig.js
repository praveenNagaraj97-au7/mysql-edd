import { join } from "path";
import { config } from "dotenv";
config({ path: join(__dirname, "config.env") });

import { Sequelize } from "sequelize";

export const connection = new Sequelize({
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  host: process.env.MYSQL_HOST,
  username: process.env.MYSQL_USERNAME,
  dialect: "postgres",
  logging: false,
});
