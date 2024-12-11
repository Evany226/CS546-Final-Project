import { users, conversations } from "../config/mongoCollections.js";
import * as helper from "../helpers.js";
import { ObjectId } from "mongodb";

const createConversation = async (currentUserId, otherUsername) => {
  helper.parameterExists(currentUserId, "currentUserId");
  helper.parameterExists(otherUsername, "otherUsername");

  helper.checkId(currentUserId);

  const userCollection = await users();
  const convCollection = await conversations();

  otherUsername = otherUsername.toLowerCase();

  const otherUser = await userCollection.findOne({
    username: otherUsername,
  });

  if (!otherUser) {
    throw new Error("User with that username does not exist");
  }

  if (currentUserId === otherUser._id.toString()) {
    throw new Error("Cannot create conversation with yourself");
  }

  const convObject = {
    participantIds: [currentUserId, otherUser._id.toString()],
    messages: [],
    createdAt: new Date(),
  };

  const existingConv = await convCollection.findOne({
    $or: [
      {
        participantIds: [currentUserId, otherUser._id.toString()],
      },
      {
        participantIds: [otherUser._id.toString(), currentUserId],
      },
    ],
  });

  if (existingConv) {
    throw new Error("Conversation already exists");
  }

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

  if (!allConversations || allConversations.length === 0) {
    return [];
  }

  const conversationResult = await Promise.all(
    allConversations.map(async (conversation) => {
      conversation._id = conversation._id.toString();
      const otherParticipantId = conversation.participantIds.find(
        (id) => id !== currentUserId
      );

      const otherParticipant = await userCollection.findOne({
        _id: new ObjectId(otherParticipantId),
      });

      if (!otherParticipant) {
        throw new Error("Could not find other participant");
      }

      return {
        ...conversation,
        otherUsername: otherParticipant.username,
      };
    })
  );

  console.log(conversationResult);

  return conversationResult;
};

const getMessages = async (conversationId, currUserId) => {
  helper.parameterExists(conversationId, "conversationId");

  helper.checkId(conversationId);

  const convCollection = await conversations();

  const conversation = await convCollection.findOne({
    _id: new ObjectId(conversationId),
  });

  if (!conversation) {
    throw new Error("Could not find conversation");
  }

  const messages = conversation.messages.map((message) => {
    message._id = message._id.toString();
    message.createdAt = message.createdAt.toLocaleDateString();
    if (message.userId === currUserId) {
      message.sentByCurrUser = true;
    }

    return message;
  });

  return messages;
};

const createMessage = async (conversationId, userId, content) => {
  helper.parameterExists(conversationId, "conversationId");
  helper.parameterExists(content, "content");

  helper.checkId(conversationId);

  const convCollection = await conversations();

  const conversation = await convCollection.findOne({
    _id: new ObjectId(conversationId),
  });

  if (!conversation) {
    throw new Error("Could not find conversation");
  }

  const messageObject = {
    _id: new ObjectId(),
    userId: userId,
    content: content,
    createdAt: new Date(),
  };

  const updatedConversation = await convCollection.findOneAndUpdate(
    {
      _id: new ObjectId(conversationId),
    },
    {
      $push: {
        messages: messageObject,
      },
    }
  );

  if (!updatedConversation) {
    throw new Error("Could not update conversation");
  }

  return updatedConversation;
};

export { createConversation, getAllConversations, getMessages, createMessage };
