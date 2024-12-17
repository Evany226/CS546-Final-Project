import { ObjectId } from "mongodb";
import {
  checkString,
  checkId,
  checkObject,
  checkCondition,
  checkListingStatus,
} from "../helpers.js";
import { listings } from "../config/mongoCollections.js";
import { getCollectionById } from "./collections.js";
import { getFigureById } from "./figures.js";

/**
 * Listings
 */

const createListing = async (
  listingName,
  userId,
  collectionId,
  listingFigureId,
  offerFigureId,
  description,
  condition,
  commentIds,
  tradeRequestsIds,
  listingStatus
) => {
  listingName = checkString(listingName, "listingName");
  userId = checkId(userId);
  collectionId = checkId(collectionId);
  listingFigureId = checkId(listingFigureId);

  offerFigureId.forEach((figure) => {
    figure = checkId(figure);
  });

  description = checkString(description, "description");

  condition = checkCondition(condition);

  commentIds.forEach((comment) => {
    comment = checkId(comment);
  });

  tradeRequestsIds.forEach((tradeRequests) => {
    tradeRequests = checkId(tradeRequests);
  });

  listingStatus = checkListingStatus(listingStatus);

  let newListing = {
    listingName,
    userId,
    collectionId,
    listingFigureId,
    offerFigureId,
    description,
    condition,
    commentIds,
    tradeRequestsIds,
    listingStatus,
  };

  const listingCollection = await listings();
  const insertInfo = await listingCollection.insertOne(newListing);
  if (!insertInfo.insertedId) throw new Error("Could not add listing");

  return insertInfo;
};

const getAllListings = async () => {
  const listingCollection = await listings();
  let listingList = await listingCollection.find({}).toArray();

  if (!listingList) throw new Error("Could not get all listings");

  const promises = await listingList.map(async (listing) => {
    const figureImg = await getFigureById(listing.listingFigureId);

    listing.listingFigureImageUrl = figureImg.figureImageUrl;

    return listing;
  });

  const listingRes = await Promise.all(promises);

  return listingRes;
};

const getListingById = async (listingId) => {
  listingId = checkId(listingId);

  const listingCollection = await listings();
  let listingById = await listingCollection.findOne({
    _id: new ObjectId(listingId),
  });

  if (!listingById) throw new Error("No listing found with that id!");

  return listingById;
};

const getListingsByUser = async (userId) => {
  userId = checkId(userId);
  const userById = await getUserById(userId);

  let listingsByUser = userById["listingIds"];
  listingsByUser.forEach(async (listing) => {
    listing = await getListingById(listing);
  });

  if (!listingsByUser)
    throw new Error(`Could not get all listing from user ${userById.username}`);

  return listingsByUser;
};

const getListingsByCollection = async (collectionId) => {
  collectionId = checkId(collectionId);
  const listingCollection = await listings();

  let listingsByCollection = listingCollection
    .find({
      collectionId: collectionId,
    })
    .toArray();

  if (!listingsByCollection)
    throw new Error(
      `Could not get all listing from collection with id of ${collectionId}`
    );

  return listingsByCollection;
};

const getListingByTradeRequest = async (tradeRequestId) => {
  tradeRequestId = checkId(tradeRequestId);
  const listingCollection = await listings();

  let listingByTradeRequest = listingCollection.findOne({
    tradeRequestsIds: tradeRequestId,
  });

  if (!listingByTradeRequest)
    throw new Error(
      `Could not get all listing from collection with id of ${tradeRequestId}`
    );

  return listingByTradeRequest;
};

const updateListing = async (listingId, updateObject) => {
  listingId = checkId(listingId);
  updateObject = checkObject(updateObject, "updateObject");
  const updateObjectKeys = Object.keys(updateObject);
  const updatedListing = await getListingById(listingId);

  if (updateObjectKeys.includes("listingName")) {
    updateObject.listingName = checkString(
      updateObject.listingName,
      "listingName"
    );
    updatedListing.listingName = updateObject.listingName;
  }

  if (updateObjectKeys.includes("userId")) {
    updateObject.userId = checkId(updateObject.userId);
    updatedListing.userId = updateObject.userId;
  }

  if (updateObjectKeys.includes("collectionId")) {
    updateObject.collectionId = checkId(updateObject.collectionId);

    updatedListing.collectionId = updateObject.collectionId;
  }

  if (updateObjectKeys.includes("listingFigureId")) {
    updateObject.listingFigureId = checkId(updateObject.listingFigureId);

    updatedListing.listingFigureId = updateObject.listingFigureId;
  }

  if (updateObjectKeys.includes("offerFigureId")) {
    updateObject.offerFigureId.forEach((figure) => {
      figure = checkId(figure);
    });

    updatedListing.offerFigureId = updateObject.offerFigureId;
  }

  if (updateObjectKeys.includes("description")) {
    updateObject.description = checkString(
      updateObject.description,
      "description"
    );

    updatedListing.description = updateObject.description;
  }

  if (updateObjectKeys.includes("condition")) {
    updateObject.condition = checkCondition(updateObject.condition);

    updatedListing.condition = updateObject.condition;
  }

  if (updateObjectKeys.includes("commentIds")) {
    updateObject.commentIds.forEach((comment) => {
      comment = checkId(comment);
    });

    updatedListing.commentIds = updateObject.commentIds;
  }

  if (updateObjectKeys.includes("tradeRequestsIds")) {
    updateObject.tradeRequestsIds.forEach((tradeRequests) => {
      tradeRequests = checkId(tradeRequests);
    });

    updatedListing.tradeRequestsIds = updateObject.tradeRequestsIds;
  }

  if (updateObjectKeys.includes("listingStatus")) {
    updateObject.listingStatus = checkListingStatus(updateObject.listingStatus);

    updatedListing.listingStatus = updateObject.listingStatus;
  }

  const listingCollection = await listings();
  const updatedInfo = await listingCollection.findOneAndUpdate(
    { _id: new ObjectId(listingId) },
    { $set: updatedListing },
    { returnDocument: "after" }
  );

  if (!updatedInfo)
    throw new Error(
      `Could not update listing with id of ${listingId} successfully`
    );

  return updatedInfo;
};

const removeListing = async (listingId) => {
  listingId = checkId(listingId);

  const listingCollection = await listings();
  const deletionInfo = await listingCollection.findOneAndDelete({
    _id: new ObjectId(listingId),
  });

  if (!deletionInfo)
    throw new Error(`Could not delete listing with id of ${listingId}`);

  return deletionInfo;
};

export {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  removeListing,
  getListingsByUser,
  getListingsByCollection,
  getListingByTradeRequest,
};
