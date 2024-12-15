import bcrypt from "bcrypt";
import { users } from "../config/mongoCollections.js";
import * as helper from "../helpers.js";

const signInUser = async (username, password) => {
  helper.parameterExists(username, "Username");
  helper.parameterExists(password, "Password");

  username = helper.checkUsername(username);

  username = username.toLowerCase();

  password = helper.checkPassword(password);

  const userCollection = await users();

  const user = await userCollection.findOne({
    username: username,
  });

  if (!user) {
    throw new Error("Either the username or password is invalid.");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Either the username or password is invalid.");
  }

  const userObject = {
    _id: user._id,
    username: user.username,
    city: user.city,
    state: user.state,
    description: user.description,
  };

  return userObject;
};

const signUpUser = async (username, password, city, state, description) => {
  helper.parameterExists(username, "Username");
  helper.parameterExists(password, "Password");
  helper.parameterExists(city, "City");
  helper.parameterExists(state, "State");
  helper.parameterExists(description, "Description");

  username = helper.checkUsername(username);

  username = username.toLowerCase();

  const userCollection = await users();

  const existingUsername = await userCollection.findOne({ username: username });

  if (existingUsername) {
    throw new Error("Username already exists");
  }

  password = helper.checkPassword(password);

  city = helper.checkCity(city);

  state = helper.checkIfValidState(state);

  description = helper.checkDescription(description);

  const hashedPassword = await bcrypt.hash(password, 16);

  const newUser = {
    username: username,
    password: hashedPassword,
    city: city,
    state: state,
    description: description,
  };

  const insertedUser = await userCollection.insertOne(newUser);

  if (!insertedUser.insertedId) {
    throw new Error("Error creating user");
  }

  return { registrationCompleted: true };
};

const signOutUser = async (req, res) => {
  req.session.destroy();

  res.redirect("/");
};

export { signInUser, signUpUser, signOutUser };
