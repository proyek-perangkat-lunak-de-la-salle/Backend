import { Sequelize } from "sequelize";
import db from "../config/database.js";
import wilayah from "./wilayahModel.js";

const { DataTypes } = Sequelize;

const user = db.define(
  "user",
  {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_wilayah: {
      type: DataTypes.INTEGER,
    },
    nama: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    role: {
      type: DataTypes.STRING,
    },
  },
  { freezeTableName: true }
);

wilayah.hasMany(user);
user.belongsTo(wilayah, { foreignKey: "id_wilayah" });

export default user;
