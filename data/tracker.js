import {
    ObjectId
} from "mongodb";
import {
    users,
    trackers, 
    collections
} from "../config/mongoCollections.js";
import {
    checkId,
    checkString
} from "../helpers.js";
import { getCollectionById } from "./collections.js";



const getTrackersByUserId = async (userId) => {
    userId = checkId(userId);

    const trackers_col = await trackers();
    const user_trackers = await trackers_col.find({
        userId: userId
    });

    if (!user_trackers) {
        throw new Error("Issues getting trackers for user");
    }

    let array = await user_trackers.toArray();
    return array;
}

// tracker functions

const createTracker = async (
    userId,
    collectionId
) => {
    userId = checkId(userId);
    collectionId = checkId(collectionId);
    let collection = await getCollectionById(collectionId);
    collection.figures.forEach((f) => {
        f.owned = false;
    });

    let newTracker = {
        userId: userId,
        collectionId: collectionId,
        collectionName: collection.collectionName,
        figureList: collection.figures
    };

    const trackers_col = await trackers();
    // check duplicate
    let result = await trackers_col.find({userId: userId, collectionId: collectionId});
    let count = await result.count();
    if (count !== 0) {
        throw new Error("Cannot have duplicates");
    }

    const user_col = await users();
    // add first to trackers, get id back
    // maybe make a transaction, want these two queries in one atomic operation
    const tracker_insert = await trackers_col.insertOne(newTracker);
    if (!tracker_insert) {
        throw new Error("Issues inserting into trackers collection - check db status");
    }
    const user_update = await user_col.updateOne({
        _id: ObjectId.createFromHexString(userId)
    }, {
        $push: {
            trackers: tracker_insert.insertedId
        }
    });

    if (!user_update.acknowledged) {
        throw new Error(`Could not add a tracker's ID to user ${userId}`);
    }

    const tracker_id = tracker_insert.insertedId.toString();

    return tracker_id;
}

export {
    getTrackersByUserId,
    createTracker
}