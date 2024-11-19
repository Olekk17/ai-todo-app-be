import { configDotenv } from "dotenv";
import { Sequelize } from "sequelize-typescript";
import { models } from "../models";
configDotenv();
const connectionString = process.env.POSTGRESQL_CONNECTION_STRING || "";

export function getDb() {
  try {
    const db = new Sequelize(connectionString, {
      models,
      dialectOptions: {
        ssl: true
      }
    });
    db.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );
    return db;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
