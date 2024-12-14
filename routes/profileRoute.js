import { Router } from "express";
import { checkId } from "../helpers.js";
import { users } from "../config/mongoCollections.js";
import { getUserById } from "../data/users.js";
import { checkAuthenticated } from "../middleware.js";

const router = Router();

router.get("/", checkAuthenticated, (req, res) => {
  const user = req.session.user;

  return res.redirect(`/profile/${user._id}`);
});

// This route is for editing the user's profile

router
  .route("/edit")
  .get(async (req, res) => {
    const user = req.session.user;

    const userData = await getUserById(user._id);

    return res.render("edit_profile", {
      title: "Edit Profile",
      userData: userData,
    });
  })
  .post(async (req, res) => {
    const user = req.session.user;
    const body = req.body;

    const userCollection = await users();

    const updatedUser = {
      username: body.username,
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      age: body.age,
    };
  });

export default router;

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
