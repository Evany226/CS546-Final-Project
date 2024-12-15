import { Router } from "express";
import { checkId } from "../helpers.js";
import { users } from "../config/mongoCollections.js";
import { getUserById } from "../data/users.js";
import { checkAuthenticated } from "../middleware.js";
import {
  checkUsername,
  checkCity,
  checkIfValidState,
  checkDescription,
} from "../helpers.js";

const router = Router();

router.get("/", checkAuthenticated, (req, res) => {
  const user = req.session.user;

  return res.redirect(`/profile/${user._id}`);
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
    });
  })
  .post(async (req, res) => {
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

      await userCollection.updateOne({ _id: user._id }, { $set: updatedUser });

      return res.redirect(`/${user._id}`);
    } catch (error) {
      return res.status(400).render("edit_profile", {
        error: error,
        partial: "profile_script",
      });
    }
  });

router.get("/:id", checkAuthenticated, async (req, res) => {
  const user = req.session.user;
  let { id } = req.params;

  const isProfileOwner = user._id === id;

  id = checkId(id);

  const userData = await getUserById(id);

  const placeholder = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return res.render("profile", {
    title: "Profile",
    userData: userData,
    isProfileOwner: isProfileOwner,
    placeholder: placeholder,
  });
});

export default router;
