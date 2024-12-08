import authRoute from "./authRoute.js";

const constructorMethod = (app) => {
  app.use("/", authRoute);

  app.use("*", (req, res) => {
    return res.sendStatus(404);
  });
};

export default constructorMethod;
