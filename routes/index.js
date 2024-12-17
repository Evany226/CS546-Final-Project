import authRoute from "./authRoute.js";
import listingsRoute from "./listingsRoute.js";
import profileRoute from "./profileRoute.js";
import convRoute from "./convRoute.js";
import collectionRoute from "./collectionRoute.js";
import adminRoute from "./admin.js";
import tradeReqRoute from "./trade-requests.js";
import figuresRoute from "./figuresRoute.js";

const constructorMethod = (app) => {
  app.use("/", collectionRoute);
  app.use("/", listingsRoute);

  app.use("/", authRoute);

  app.use("/profile", profileRoute);

  app.use("/conversations", convRoute);

  app.use("/admin", adminRoute);

  app.use("/figures", figuresRoute);

  app.use("/trade-requests", tradeReqRoute);

  app.use("*", (req, res) => {
    return res.sendStatus(404);
  });

  app.use("/notFound", (req, res) => {
    return res.status(404).json({ error: "Not found" });
  });
};

export default constructorMethod;
