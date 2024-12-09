import express from "express";
const app = express();
import configRoutes from "./routes/index.js";
import exphbs from "express-handlebars";
import session from "express-session";
import {
  createConversation,
  getAllConversations,
} from "./data/conversation.js";

const staticDir = express.static("public");

app.use("/public", staticDir);
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

const testFunc = async () => {
  console.log("Test function called");

  const allConv = await getAllConversations("6755f6a721ca4bceed279a0c");

  console.log(allConv);
};

testFunc();

const handlebarsInstance = exphbs.create({
  defaultLayout: "main",
  helpers: {
    partialsDir: ["views/partials/"],
  },
});

app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
