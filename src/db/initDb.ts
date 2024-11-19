import { getDb } from "./getDb";
import { models } from "../models";

const initDb = async () => {
  const db = getDb();

  db?.addModels(models);
  await Promise.all(models.map((model) => model.sync({ alter: true })));
};

initDb();
