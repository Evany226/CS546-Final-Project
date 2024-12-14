import { ObjectId } from "mongodb";
import { checkString, checkId } from "../helpers.js";
import { users } from "../config/mongoCollections.js";
import { getCollectionById } from "./collections.js";

/**
 * Users
 */

const createUser = async () => {};

const getAllUsers = async () => {};

const getUserById = async (userId) => {
  const userCollection = await users();

  userId = checkId(userId);

  const user = await userCollection.findOne({
    _id: ObjectId.createFromHexString(userId),
  });

  if (!user) {
    throw new Error("User not found");
  }

  user._id = user._id.toString();

  return user;
};

const updateUser = async (userId, updateObject) => {};

const removeUser = async (userId) => {};

export { createUser, getAllUsers, getUserById, updateUser, removeUser };
