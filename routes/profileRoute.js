import { Router } from "express";
import { checkString } from "../helpers.js";
import { users } from "../config/mongoCollections.js";
import { getUserById, getUserByUsername } from "../data/users.js";
import { getAllCollections } from "../data/collections.js";
import { getTrackersByUserId } from "../data/tracker.js";
import { checkAuthenticated } from "../middleware.js";
import { ObjectId } from "mongodb";
import {
  checkUsername,
  checkCity,
  checkIfValidState,
  checkDescription,
} from "../helpers.js";

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

router.get("/", checkAuthenticated, (req, res) => {
  const user = req.session.user;

  return res.redirect(`/profile/${user.username}`);
});

// This route is for editing the user's profile
router
  .route("/edit")
  .get(checkAuthenticated, async (req, res) => {
    const user = req.session.user;

    const userData = await getUserById(user._id);

    return res.render("edit_profile", {
      title: "Edit Profile",
      userData: userData,
      partial: "profile_script",
      states: states,
    });
  })
  .post(checkAuthenticated, async (req, res) => {
    const user = req.session.user;
    const body = req.body;

    try {
      if (!body || Object.keys(body) === 0) {
        throw new Error("No body provided");
      }

      let { username, city, state, description } = body;

      username = checkUsername(username);

      username = username.toLowerCase();

      city = checkCity(city);

      state = checkIfValidState(state);

      description = checkDescription(description);

      const userCollection = await users();

      const updatedUser = {
        username: username,
        city: city,
        state: state,
        description: description,
      };

      const updatedResult = await userCollection.findOneAndUpdate(
        { _id: ObjectId.createFromHexString(user._id) },
        { $set: updatedUser }
      );

      console.log(user);
      console.log(updatedResult);

      return res.redirect(`/profile/${user._id}`);
    } catch (error) {
      return res.status(400).render("edit_profile", {
        error: error,
        userData: body,
        partial: "profile_script",
      });
    }
  });


router.get("/tracker", checkAuthenticated, async (req, res) => {
  let collections = await getAllCollections();
  res.render("tracker", { collections: collections });
});

router.get("/:username", checkAuthenticated, async (req, res) => {
  const user = req.session.user;
  let { username } = req.params;

  const isProfileOwner = user.username === username;

  try {
    username = checkString(username);
  } catch(e) {
    return res.redirect("/profile");
  }

  let userData
  try {
    userData = await getUserByUsername(username);
  }catch(e) {
    // something went wrong getting to username? just gonna route to /
    return res.end();
  }
  

  const placeholder = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return res.render("profile", {
    title: "Profile",
    userData: userData,
    isProfileOwner: isProfileOwner,
    placeholder: placeholder,
  });
});

export default router;
