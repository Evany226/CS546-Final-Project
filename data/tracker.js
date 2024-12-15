import {ObjectId} from "mongodb";
import { trackers } from "../config/mongoCollections.js";
import { checkId, checkString } from "../helpers.js";

const createTracker = async (
    userId,
    collectionId
) => {
    userId = checkId(userId);
    collectionId = checkId(collectionId);

    let newTracker = {
        userId: userId,
        collectionId: collectionId,
        figureList : []
    };

    const tracker_col = await trackers();
    const insertion_info = await tracker_col.insertOne(newTracker);

    if (!insertion_info.acknowledged || !insertion_info.insertedId) {
        throw new Error(`Could not add a tracker to userId ${userId}`);
    }

    const newId = insertion_info.insertedId.toString();

    return newId;
}

const getTrackersByUserId = async (userId) => {
    userId = checkId(userId);
    let output = [];

    const tracker_col = await trackers();
    const cursor = await tracker_col.find({userId: userId});

    await cursor.forEach((tracker) => {
        output.push(tracker);
    });
    return output;
}

export { getTrackersByUserId, createTracker }

