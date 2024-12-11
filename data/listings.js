import { ObjectId } from "mongodb";
import { checkString, checkId, checkObject, checkCondition, checkStatus } from "../helpers.js";
import { listings } from "../config/mongoCollections.js";
import { getCollectionById } from "./collections.js";

/**
 * Listings
 */

const createListing = async (
    listingName,
    userId,
    collectionId,
    offerFigureId,
    requestFigureId,
    description,
    condition,
    commentIds,
    tradeRequestsId,
    status
) => {
    listingName = checkString(listingName, 'listingName');
    userId = checkId(userId);
    collectionId = checkId(collectionId);
    offerFigureId = checkId(offerFigureId);

    requestFigureId.forEach( (figure) => {
        figure = checkId(figure);
    })

    description = checkString(description, 'description');

    condition = checkCondition(condition);

    commentIds.forEach( (comment) => {
        comment = checkId(comment);
    })

    tradeRequestsId.forEach( (tradeRequests) => {
        tradeRequests = checkId(tradeRequests);
    })

    status = checkStatus(status);

    let newListing = {
        listingName,
        userId,
        collectionId,
        offerFigureId,
        requestFigureId,
        description,
        condition,
        commentIds,
        tradeRequestsId,
        status
    };

    const listingCollection = await listings();
    const insertInfo = await listingCollection.insertOne(newListing);
    if (!insertInfo.insertedId) throw new Error('Could not add listing');

    return insertInfo;
};

const getAllListings = async () =>{
    const listingCollection = await listings();
    let listingList = await listingCollection.find({}).toArray();

    if (!listingList) throw new Error('Could not get all listings');

    console.log(listingList);

    return listingList;
};

const getListingById = async(listingId) =>{
    listingId = checkId(listingId);

    const listingCollection = await listings();
    let listingById = await listingCollection.findOne({_id : new ObjectId(listingId)});

    if (!listingById) throw new Error('No listing found with that id!');

    return listingById;
};

const updateListing = async (listingId, updateObject) =>{
    listingId = checkId(listingId);
    updateObject = checkObject(updateObject, 'updateObject');
    const updateObjectKeys = Object.keys(updateObject);
    const updatedListing = await getListingById(listingId);

    console.log(updateObject);

    if (updateObjectKeys.includes('listingName')) {
        updateObject.listingName = checkString(updateObject.listingName,'listingName');
        updateListing.listingName = updateObject.listingName;
        console.log(updateListing)
    }

    if (updateObjectKeys.includes('userId')) {
        updateObject.userId = checkId(updateObject.userId);
        updatedListing.userId = updateObject.userId;
    }
    
    if (updateObjectKeys.includes('collectionId')) {
        updateObject.collectionId = checkId(updateObject.collectionId);

        updatedListing.collectionId = updateObject.collectionId;
    }

    if (updateObjectKeys.includes('offerFigureId')) {
        updateObject.offerFigureId = checkId(updateObject.offerFigureId);

        updatedListing.offerFigureId = updateObject.offerFigureId;
    }

    if (updateObjectKeys.includes('requestFigureId')) {
        updateObject.requestFigureId.forEach( (figure) => {
            figure = checkId(figure);
        })

        updatedListing.requestFigureId = updateObject.requestFigureId;
    }

    if (updateObjectKeys.includes('description')) {
        updateObject.description = checkString(updateObject.description, "description");

        updatedListing.description = updateObject.description;
    }

    if (updateObjectKeys.includes('condition')) {
        updateObject.condition = checkCondition(updateObject.condition);

        updatedListing.condition = updateObject.condition;
    }

    if (updateObjectKeys.includes('commentIds')) {
        updateObject.commentIds.forEach( (comment) => {
            comment = checkId(comment);
        })

        updatedListing.commentIds = updateObject.commentIds;
    }

    if (updateObjectKeys.includes('tradeRequestsId')) {
        updateObject.tradeRequestsId.forEach( (tradeRequests) => {
            tradeRequests = checkId(tradeRequests);
        })

        updatedListing.tradeRequestsId = updateObject.tradeRequestsId;
    }

    if (updateObjectKeys.includes('status')) {
        updateObject.status = checkStatus(updateObject.status);

        updatedListing.status= updateObject.status;
    }
    
    const listingCollection = await listings();
    const updatedInfo = await listingCollection.findOneAndUpdate(
        {_id: new ObjectId(listingId)},
        {$set: updatedListing},
        {returnDocument: "after"}
    );
    console.log(updatedInfo);
    if (updatedInfo) throw new Error(`Could not update listing with id of ${listingId} successfully`);

    return updatedInfo;
};

const removeListing = async (listingId) =>{
    listingId = checkId(listingId);

    const listingCollection = await listings();
    const deletionInfo = await listingCollection.findOneAndDelete({
        _id: new ObjectId(listingId)
    });

    if (!deletionInfo) throw new Error(`Could not delete listing with id of ${listingId}`);

    return deletionInfo;
};

export {createListing, getAllListings, getListingById, updateListing, removeListing};