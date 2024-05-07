import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const informasiPJK = db.define(
  "informasiPJK",
  {
    id_informasiPJK: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cluster: {
      type: DataTypes.STRING,

    },
    info: {
        type: DataTypes.TEXT,
    }
  },
  { freezeTableName: true }
);

export default informasiPJK;