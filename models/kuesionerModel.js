import { Sequelize } from "sequelize";
import db from "../config/database.js";

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
     mual: {
      type: DataTypes.STRING,
    },
    sesak_napas: {
      type: DataTypes.STRING,
    },
    nyeri_uluhati: {
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

export default kuesioner;
