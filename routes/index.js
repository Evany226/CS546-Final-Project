import authRoute from "./authRoute.js";
import listingsRoute from "./listingsRoute.js";
import profileRoute from "./profileRoute.js";
import convRoute from "./convRoute.js";

const constructorMethod = (app) => {
  app.use("/", listingsRoute);

  app.use("/", authRoute);

  app.use("/profile", profileRoute);

  app.use("/messages", convRoute);

  app.use("*", (req, res) => {
    return res.sendStatus(404);
  });
};

export default constructorMethod;
