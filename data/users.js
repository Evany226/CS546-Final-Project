import { ObjectId } from "mongodb";
import {
  checkString,
  checkId,
  checkUsername,
  checkIfValidState,
  checkCity,
  checkDescription,
  checkObject,
} from "../helpers.js";
import { users, collections } from "../config/mongoCollections.js";
import { getCollectionById } from "./collections.js";

/**
 * Users
 */

const createUser = async () => {};

const getAllUsers = async () => {};

const getUserByUsername = async (username) => {
  const userCollection = await users();

  username = checkString(username);
  const user = await userCollection.findOne({
    username: username
  });

  if (!user) {
    throw new Error("User not found");
  }

  user._id = user._id.toString();
  return user;
}

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

const updateUser = async (userId, updateObject) => {
  const userCollection = await users();

  userId = checkId(userId);
  updateObject = checkObject(updateObject, "updateObject");

  if (!updateObject || Object.keys(updateObject).length === 0) {
    throw new Error("No update object provided");
  }

  if (updateObject.username) {
    updateObject.username = checkUsername(updateObject.username);
    const existingUsername = await userCollection.findOne({
      username: username,
    });

    if (existingUsername) {
      throw new Error("Username already exists");
    }
  }

  if (updateObject.city) {
    updateObject.city = checkCity(updateObject.city);
  }

  if (updateObject.state) {
    updateObject.state = checkIfValidState(updateObject.state);
  }

  if (updateObject.description) {
    updateObject.description = checkDescription(updateObject.description);
  }

  const updatedUser = {
    username: updateObject.username,
    city: updateObject.city,
    state: updateObject.state,
    description: updateObject.description,
  };

  await userCollection.updateOne(
    { _id: ObjectId.createFromHexString(userId) },
    { $set: updatedUser }
  );

  return await getUserById(userId);
};

const removeUser = async (userId) => {
  userId = checkString(userId, "userId");
  userId = checkId(userId);

	const userCollection = await users();
	const deletionInfo = await userCollection.findOneAndDelete({
		_id: ObjectId.createFromHexString(userId)
	})

	if (!deletionInfo) {
		throw `Could not delete collection with id of ${userId}`;
	}

	return {_id: userId, deleted: true};
};

export { createUser, getAllUsers, getUserById, updateUser, removeUser, getUserByUsername };
