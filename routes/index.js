import authRoute from "./authRoute.js";
import listingsRoute from "./listingsRoute.js";
import profileRoute from "./profileRoute.js";

const constructorMethod = (app) => {
  app.use("/", listingsRoute);

  app.use("/", authRoute);

  app.use("/profile", profileRoute);

  app.use("*", (req, res) => {
    return res.sendStatus(404);
  });
};

export default constructorMethod;
