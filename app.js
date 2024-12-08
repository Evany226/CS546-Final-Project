import express from "express";
const app = express();
import configRoutes from "./routes/index.js";
import exphbs from "express-handlebars";
import session from "express-session";

app.use(express.json());

app.use(
  session({
    name: "AuthenticationState",
    secret: "SecretString",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30000,
    },
  })
);

app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const staticDir = express.static("public");

app.use("/public", staticDir);

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
