import { Router } from "express";
import * as helper from "../helpers.js";
import { signUpUser, signInUser } from "../data/auth.js";

const router = Router();

const states = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

router
  .route("/sign-in")
  .get(async (req, res) => {
    return res.render("signin", { partial: "auth_script" });
  })
  .post(async (req, res) => {
    const body = req.body;

    try {
      if (!body || Object.keys(body).length === 0) {
        throw new Error("You must provide data to sign in");
      }

      let { username, password } = body;

      helper.parameterExists(username, "Username");
      helper.parameterExists(password, "Password");

      username = helper.checkUsername(username);

      username = username.toLowerCase();

      const user = await signInUser(username, password);

      if (!user) {
        throw new Error("Either the username or password is invalid.");
      }

      req.session.user = user;

      res.redirect("/");
    } catch (error) {
      console.log(error);
      return res.render("signin", {
        error: error.message,
        partial: "auth_script",
      });
    }
  });

router
  .route("/sign-up")
  .get(async (req, res) => {
    return res.render("signup", { states: states, partial: "auth_script" });
  })
  .post(async (req, res) => {
    const body = req.body;

    try {
      if (!body || Object.keys(body).length === 0) {
        throw new Error("You must provide data to sign up");
      }

      let { username, password, city, state, description } = body;

      helper.parameterExists(username, "Username");
      helper.parameterExists(password, "Password");
      helper.parameterExists(city, "City");
      helper.parameterExists(state, "State");
      helper.parameterExists(description, "Description");

      username = helper.checkUsername(username);

      username = username.toLowerCase();

      password = helper.checkPassword(password);

      city = helper.checkCity(city);

      state = helper.checkIfValidState(state);

      description = helper.checkDescription(description);

      const newUser = await signUpUser(
        username,
        password,
        city,
        state,
        description
      );

      if (newUser.registrationCompleted) {
        return res.redirect("/sign-in");
      } else {
        return res.status(500).json({ error: "Error creating user" });
      }
    } catch (error) {
      console.log(error);
      return res.render("signup", {
        error: error.message,
        states: states,
        partial: "auth_script",
      });
    }
  });

router.route("/sign-out").get(async (req, res) => {
  res.session.destroy();
  res.render("signout");
});

export default router;
