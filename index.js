import express from "express";
import db from "./config/database.js";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import wilayahRoute from "./routes/wilayahRoute.js";
import authRoute from "./routes/authRoute.js";
import rolesRoute from "./routes/rolesRoute.js";
import kuesionerRoute from "./routes/kuesionerRoute.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(userRoute);
app.use(wilayahRoute);
app.use(authRoute);
app.use(rolesRoute);
app.use(kuesionerRoute);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

(async () => {
  await db.sync();
})();
