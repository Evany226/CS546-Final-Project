import { ObjectId } from "mongodb";
import { checkString, checkId, checkObject, checkDate, checkNumber, checkTransactionStatus } from "../helpers.js";
import { tradeRequests, listings } from "../config/mongoCollections.js";
import { getCollectionById } from "./collections.js";
import { getListingById } from "./listings.js";


const createTradeRequest = async (
    listingId,
    listingFigureId,
    offeringFigureId,
    toUserId,
    fromUserId,
    transactionStatus,
    completionStatus,
    date
) => {
    listingId = checkId(listingId);
    listingFigureId = checkId(listingFigureId);
    offeringFigureId = checkId(offeringFigureId);
    toUserId = checkId(toUserId);
    fromUserId = checkId(fromUserId);

    transactionStatus = checkTransactionStatus(transactionStatus);
    if (typeof(completionStatus) !== 'boolean') throw new Error('completionStatus must be type boolean');

    date = checkDate(date);

    let newTradeRequest = {
        listingId,
        listingFigureId,
        offeringFigureId,
        toUserId,
        fromUserId,
        transactionStatus,
        completionStatus,
        date
    };


    const listingCollection = await listings();
    const tradeRequestCollection = await tradeRequests();
    const insertInfo = await tradeRequestCollection.insertOne(newTradeRequest);
    if (!insertInfo.insertedId) throw new Error('Could not add trade request');

    const tradeRequestsId = insertInfo.insertedId.toString();
    const updateListing = await listingCollection.updateOne({_id: new ObjectId(listingId)},{$push: {tradeRequestsId}});





    return insertInfo;
}

const getTradeRequestById = async (tradeRequestId) =>{
    tradeRequestId = checkId(tradeRequestId);

    const tradeRequestCollection = await tradeRequests();
    let tradeRequestById = await tradeRequestCollection.findOne({_id : new ObjectId(tradeRequestId)});

    if (!tradeRequestById) throw new Error('No trade request found with that id!');

    return tradeRequestById;
};


const getAllTradeRequests = async () =>{
    const tradeRequestCollection = await tradeRequests();
    let tradeRequestList = await tradeRequestCollection.find({}).toArray();

    if (!tradeRequestList) throw new Error('Could not get all trade requests');

    return tradeRequestList;
};

const getTradeRequestsByListing = async (listingId) =>{

    let listingById = checkId(listingId);
    listingById = await getListingById(listingId);
    
    let tradeRequestByListing = listingById['tradeRequestIds']
    tradeRequestByListing.forEach( async (tradeRequest) => {
        tradeRequest = await getTradeRequestById(tradeRequest);
    }); 

    if (!tradeRequestByListing) throw new Error(`Could not get all trade requests from listing ${listingById.listingName}`);

    return tradeRequestByListing;
};


const getTradeRequestsByUser = async (userId) =>{

    let userById = checkId(userId);
    userById = await getuserById(userId);
    
    let tradeRequestByUser = userById['tradeRequestIds']
    tradeRequestByUser.forEach( async (tradeRequest) => {
        tradeRequest = await getTradeRequestById(tradeRequest);
    }); 

    if (!tradeRequestByUser) throw new Error(`Could not get all trade requests from user ${userById.username}`);

    return tradeRequestByUser;
};

const updateTradeRequest = async (tradeRequestId, updateObject) =>{
    tradeRequestId = checkId(tradeRequestId);
    updateObject = checkObject(updateObject, 'updateObject');
    const updateObjectKeys = Object.keys(updateObject);
    const updatedTradeRequest = await getTradeRequestById(tradeRequestId);

    if (updateObjectKeys.includes('listingId')) {
        updateObject.listingId=  checkId(updateObject.listingId);
        updatedTradeRequest.listingId = updateObject.listingId;
    }

    if (updateObjectKeys.includes('listingFigureId')) {
        updateObject.listingFigureId = checkId(updateObject.listingFigureId);
        updatedTradeRequest.listingFigureId = updateObject.listingFigureId;
    }

    if (updateObjectKeys.includes('offeringFigureId')) {
        updateObject.offeringFigureId = checkId(updateObject.offeringFigureId);
        updatedTradeRequest.offeringFigureId = updateObject.offeringFigureId;
    }

    if (updateObjectKeys.includes('toUserId')) {
        updateObject.toUserId = checkId(updateObject.toUserId);
        updatedTradeRequest.toUserId = updateObject.toUserId;
    }

    if (updateObjectKeys.includes('fromUserId')) {
        updateObject.fromUserId = checkId(updateObject.fromUserId);
        updatedTradeRequest.fromUserId = updateObject.fromUserId;
    }

    if (updateObjectKeys.includes('transactionStatus')) {
        updateObject.transactionStatus = checkTransactionStatus(updateObject.transactionStatus);

        updatedTradeRequest.transactionStatus = updateObject.transactionStatus;
    }

    if (updateObjectKeys.includes('completionStatus')) {
        if (typeof(updateObject.completionStatus) !== 'boolean') throw new Error('completionStatus must be type boolean');

        updatedTradeRequest.completionStatus = updateObject.completionStatus;
    }
 
    if (updateObjectKeys.includes('date')) {
        updateObject.date = checkDate(updateObject.date, 'date');

        updatedTradeRequest.date = updateObject.date;
    }
   
    const tradeRequestCollection = await tradeRequests();
    const updatedInfo = await tradeRequestCollection.findOneAndUpdate(
        {_id: new ObjectId(tradeRequestId)},
        {$set: updatedTradeRequest},
        {returnDocument: "after"}
    );
    console.log(updatedInfo);
    if (!updatedInfo) throw new Error(`Could not update trade request with id of ${tradeRequestId} successfully`);

    return updatedInfo;
};

const removeTradeRequest = async (tradeRequestId) =>{
    tradeRequestId = checkId(tradeRequestId);

    const tradeRequestCollection = await tradeRequests();
    const deletionInfo = await tradeRequestCollection.findOneAndDelete({
        _id: new ObjectId(tradeRequestId)
    });

    if (!deletionInfo) throw new Error(`Could not delete trade request with id of ${tradeRequestId}`);

    return deletionInfo;
};


export {createTradeRequest, getTradeRequestsByUser, getTradeRequestsByListing, getTradeRequestById, updateTradeRequest, removeTradeRequest};
