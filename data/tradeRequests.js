import { ObjectId } from "mongodb";
import {
  checkString,
  checkId,
  checkObject,
  checkDate,
  checkNumber,
  checkTransactionStatus,
} from "../helpers.js";
import { tradeRequests, listings } from "../config/mongoCollections.js";
import { getCollectionById } from "./collections.js";
import { getListingById } from "./listings.js";
import { getUserById } from "./users.js";
import { getFigureById } from "./figures.js";

const createTradeRequest = async (
  listingId,
  listingFigureId,
  offeringFigureId,
  toUserId,
  fromUserId,
  transactionStatus
) => {
  listingId = checkId(listingId);
  listingFigureId = checkId(listingFigureId);
  offeringFigureId = checkId(offeringFigureId);
  toUserId = checkId(toUserId);
  fromUserId = checkId(fromUserId);

  transactionStatus = checkTransactionStatus(transactionStatus);
  const date = new Date();

  let newTradeRequest = {
    listingId,
    listingFigureId,
    offeringFigureId,
    toUserId,
    fromUserId,
    transactionStatus,
    date,
  };

  const listingCollection = await listings();
  const tradeRequestCollection = await tradeRequests();
  const insertInfo = await tradeRequestCollection.insertOne(newTradeRequest);
  if (!insertInfo.insertedId) throw new Error("Could not add trade request");

  const tradeRequestsId = insertInfo.insertedId.toString();
  const updateListing = await listingCollection.updateOne(
    { _id: new ObjectId(listingId) },
    { $push: { tradeRequestsId } }
  );

  return insertInfo;
};

const getTradeRequestById = async (tradeRequestId) => {
  tradeRequestId = checkId(tradeRequestId);

  const tradeRequestCollection = await tradeRequests();
  let tradeRequestById = await tradeRequestCollection.findOne({
    _id: new ObjectId(tradeRequestId),
  });

  if (!tradeRequestById)
    throw new Error("No trade request found with that id!");

  return tradeRequestById;
};

const getAllTradeRequests = async () => {
  const tradeRequestCollection = await tradeRequests();
  let tradeRequestList = await tradeRequestCollection.find({}).toArray();

  if (!tradeRequestList) throw new Error("Could not get all trade requests");

  return tradeRequestList;
};

const getTradeRequestsByListing = async (listingId) => {
  let listingById = checkId(listingId);
  listingById = await getListingById(listingId);

  let tradeRequestByListing = listingById["tradeRequestIds"];
  tradeRequestByListing.forEach(async (tradeRequest) => {
    tradeRequest = await getTradeRequestById(tradeRequest);
  });

  if (!tradeRequestByListing)
    throw new Error(
      `Could not get all trade requests from user ${userById.username}`
    );

  return tradeRequestByListing;
};

const getTradeRequestsByUser = async (userId) => {
  let userById = checkId(userId);
  userById = await getUserById(userId);

  const tradeReqCollection = await tradeRequests();

  const tradeRequestsByUser = await tradeReqCollection
    .find({
      fromUserId: userById._id,
    })
    .toArray();

  if (!tradeRequestsByUser)
    throw new Error(
      `Could not get all trade requests from user ${userById.username}`
    );

  const promise = tradeRequestsByUser.map(async (tradeRequest) => {
    const offerFigure = await getFigureById(tradeRequest.offeringFigureId);

    tradeRequest.offerFigureImg = offerFigure.figureImageUrl;

    const listingFigure = await getFigureById(tradeRequest.listingFigureId);

    tradeRequest.listingFigureImg = listingFigure.figureImageUrl;

    return tradeRequest;
  });

  const res = await Promise.all(promise);

  return res;
};

const getTradeRequestsToUser = async (userId) => {
  let userById = checkId(userId);
  userById = await getUserById(userId);

  const tradeReqCollection = await tradeRequests();

  const tradeRequestsToUser = await tradeReqCollection
    .find({
      toUserId: userById._id,
      transactionStatus: "Pending",
    })
    .toArray();

  if (!tradeRequestsToUser)
    throw new Error(
      `Could not get all trade requests to user ${userById.username}`
    );

  const promise = tradeRequestsToUser.map(async (tradeRequest) => {
    const offerFigure = await getFigureById(tradeRequest.offeringFigureId);

    tradeRequest.offerFigure = offerFigure;

    const listingFigure = await getFigureById(tradeRequest.listingFigureId);

    tradeRequest.listingFigure = listingFigure;

    const fromUser = await getUserById(tradeRequest.fromUserId);

    tradeRequest.fromUsername = fromUser.username;

    return tradeRequest;
  });

  const res = await Promise.all(promise);

  return res;
};

const updateTradeRequest = async (tradeRequestId, updateObject) => {
  tradeRequestId = checkId(tradeRequestId);
  updateObject = checkObject(updateObject, "updateObject");
  const updateObjectKeys = Object.keys(updateObject);
  const updatedTradeRequest = await getTradeRequestById(tradeRequestId);

  if (updateObjectKeys.includes("listingId")) {
    updateObject.listingId = checkId(updateObject.listingId);
    updatedTradeRequest.listingId = updateObject.listingId;
  }

  if (updateObjectKeys.includes("listingFigureId")) {
    updateObject.listingFigureId = checkId(updateObject.listingFigureId);
    updatedTradeRequest.listingFigureId = updateObject.listingFigureId;
  }

  if (updateObjectKeys.includes("offeringFigureId")) {
    updateObject.offeringFigureId = checkId(updateObject.offeringFigureId);
    updatedTradeRequest.offeringFigureId = updateObject.offeringFigureId;
  }

  if (updateObjectKeys.includes("toUserId")) {
    updateObject.toUserId = checkId(updateObject.toUserId);
    updatedTradeRequest.toUserId = updateObject.toUserId;
  }

  if (updateObjectKeys.includes("fromUserId")) {
    updateObject.fromUserId = checkId(updateObject.fromUserId);
    updatedTradeRequest.fromUserId = updateObject.fromUserId;
  }

  if (updateObjectKeys.includes("transactionStatus")) {
    updateObject.transactionStatus = checkTransactionStatus(
      updateObject.transactionStatus
    );

    updatedTradeRequest.transactionStatus = updateObject.transactionStatus;
  }

  if (updateObjectKeys.includes("date")) {
    updateObject.date = checkDate(updateObject.date, "date");

    updatedTradeRequest.date = updateObject.date;
  }

  const tradeRequestCollection = await tradeRequests();
  const updatedInfo = await tradeRequestCollection.findOneAndUpdate(
    { _id: new ObjectId(tradeRequestId) },
    { $set: updatedTradeRequest },
    { returnDocument: "after" }
  );

  if (!updatedInfo)
    throw new Error(
      `Could not update trade request with id of ${tradeRequestId} successfully`
    );

  return updatedInfo;
};

const removeTradeRequest = async (tradeRequestId) => {
  tradeRequestId = checkId(tradeRequestId);

  const tradeRequestCollection = await tradeRequests();
  const deletionInfo = await tradeRequestCollection.findOneAndDelete({
    _id: new ObjectId(tradeRequestId),
  });

  if (!deletionInfo)
    throw new Error(
      `Could not delete trade request with id of ${tradeRequestId}`
    );

  return deletionInfo;
};

export {
  createTradeRequest,
  getTradeRequestsByUser,
  getTradeRequestsByListing,
  getTradeRequestById,
  updateTradeRequest,
  removeTradeRequest,
  getTradeRequestsToUser,
};
