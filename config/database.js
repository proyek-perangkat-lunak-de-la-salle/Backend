import { Sequelize } from "sequelize";

const db = new Sequelize("db_pjk", "root", "", {
    host: "localhost",
    dialect: "mysql"
});

export default db;