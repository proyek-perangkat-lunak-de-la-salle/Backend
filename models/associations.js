import user from "./userModel.js";
import kuesioner from "./kuesionerModel.js";
import history from "./historyModel.js";
import informasiPJK from "./informasiPJKModel.js";


user.hasOne(kuesioner, { foreignKey: "id_user" });
kuesioner.belongsTo(user, { foreignKey: "id_user" });

user.hasMany(history, { foreignKey: "id_user" });
history.belongsTo(user, { foreignKey: "id_user" });

history.belongsTo(informasiPJK, { foreignKey: "cluster" });
informasiPJK.hasMany(history, { foreignKey: "cluster" });