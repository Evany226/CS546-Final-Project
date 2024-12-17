import express from "express";
const app = express();
import configRoutes from "./routes/index.js";
import exphbs from "express-handlebars";
import session from "express-session";
import "dotenv/config";
import { getUserByUsername } from "./data/users.js";
import { signUpAdmin } from "./data/auth.js";
import { seedDB } from "./config/seed.js";

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
      maxAge: 30 * 60 * 1000,
    },
  })
);

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

async function startServer() {
  // create admin account if it doesn't exist in the database
  // taken from .env (for now)
  process.env.ADMIN_USERNAME = "testadmin";
  process.env.ADMIN_PASSWORD = "SamplePass1!"
  await signUpAdmin(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    console.log("create a .env with the ADMIN_USERNAME and ADMIN_PASSWORD");
    return;
  }
  try {
    let superadmin = await getUserByUsername(process.env.ADMIN_USERNAME);
    console.log(
      `Admin user ${process.env.ADMIN_USERNAME} found. Initializing server...`
    );
  } catch (e) {
    console.log(
      "Admin user missing but configuration found. Creating user now..."
    );
    try {
      await signUpAdmin(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);

      console.log("Admin created.");
    } catch (e) {
      console.log(`Admin creation error: \n${e}`);
      return;
    }
  }

  //seed database
   await seedDB();

  app.listen(3000, async () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
  });
}

startServer();
