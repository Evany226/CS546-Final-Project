import { users, conversations } from "../config/mongoCollections.js";
import * as helper from "../helpers.js";
import { ObjectId } from "mongodb";

const createConversation = async (currentUserId, otherUsername) => {
  helper.parameterExists(currentUserId, "currentUserId");
  helper.parameterExists(otherUsername, "otherUsername");

  helper.checkId(currentUserId);

  const userCollection = await users();
  const convCollection = await conversations();

  const otherUser = await userCollection.findOne({
    username: otherUsername,
  });

  if (!otherUser) {
    throw new Error("User with that username does not exist");
  }

  const convObject = {
    participantIds: [currentUserId, otherUser._id.toString()],
    messages: [],
    date: new Date(),
  };

  const newConversation = await convCollection.insertOne(convObject);

  if (!newConversation.insertedId) {
    throw new Error("Could not create conversation");
  }

  return newConversation;
};

const getAllConversations = async (currentUserId) => {
  helper.parameterExists(currentUserId, "currentUserId");

  helper.checkId(currentUserId);

  const userCollection = await users();
  const convCollection = await conversations();

  //finds all conversations that the user is a part of
  const allConversations = await convCollection
    .find({
      participantIds: currentUserId,
    })
    .toArray();

  allConversations.map((conversation) => {
    conversation._id = conversation._id.toString();
  });

  if (!allConversations) {
    throw new Error("Could not find any conversations");
  }

  return allConversations;
};

export { createConversation, getAllConversations };
