import authRoute from "./authRoute.js";
import listingsRoute from "./listingsRoute.js";
import profileRoute from "./profileRoute.js";
import convRoute from "./convRoute.js";
import collectionRoute from "./collectionRoute.js"

const constructorMethod = (app) => {
  app.use("/", collectionRoute)
  app.use("/", listingsRoute);

  app.use("/", authRoute);

  app.use("/profile", profileRoute);

  app.use("/conversations", convRoute);

  app.use("*", (req, res) => {
    return res.sendStatus(404);
  });

  app.use("/notFound", (req, res) => {
    return res.status(404).json({ error: "Not found" });
  });
};

export default constructorMethod;
