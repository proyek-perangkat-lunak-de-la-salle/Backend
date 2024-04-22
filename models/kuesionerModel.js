import { Sequelize } from "sequelize";
import db from "../config/database.js";
import user from "./userModel.js";

const { DataTypes } = Sequelize;

const kuesioner = db.define(
  "kuesioner",
  {
    id_kuesioner: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
    },
    jenis_kelamin: {
      type: DataTypes.STRING,
    },
    tinggi_badan: {
      type: DataTypes.INTEGER,
    },
    berat_badan: {
      type: DataTypes.INTEGER,
    },
    paham_pjk: {
      type: DataTypes.STRING,
    },
    checkup_rutin: {
      type: DataTypes.STRING,
    },
    nyeri_dada: {
      type: DataTypes.STRING,
    },
    sesak_napas: {
      type: DataTypes.STRING,
    },
    mual: {
      type: DataTypes.STRING,
    },
    nyeri_ulu_hati: {
      type: DataTypes.STRING,
    },
    hipertensi: {
      type: DataTypes.STRING,
    },
    obesitas: {
      type: DataTypes.STRING,
    },
    diabetes: {
      type: DataTypes.STRING,
    },
    genetika: {
      type: DataTypes.STRING,
    },
  },
  { freezeTableName: true }
);

kuesioner.belongsTo(user, { foreignKey: "id_user" })

export default kuesioner;
