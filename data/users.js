import { ObjectId } from "mongodb";
import { checkId, checkString } from "../helpers.js";
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

const updateUser = async (UserId, updateObject) => {};

const removeUser = async (UserId) => {};

export { createUser, getAllUsers, getUserById, updateUser, removeUser };
