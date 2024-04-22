import { Sequelize } from "sequelize";
import db from "../config/database.js";
import user from "./userModel.js";

const { DataTypes } = Sequelize;

const wilayah = db.define(
  "wilayah",
  {
    id_wilayah: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_wilayah: {
      type: DataTypes.STRING,
    },
  },
  { freezeTableName: true }
);

export default wilayah;