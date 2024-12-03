import {ObjectId, ReturnDocument} from "mongodb";
import { collections } from "../config/mongoCollections.js";
import { checkId, checkString } from "../helper.js";

/**
 * This is the Collections document to create a category for the figures
 */



/** 
 * Create Figure Collection
 * inputs are name, image url, and figure list
 */
const createCollection = async (
    collectionName,
    collectionImageUrl
) => {

    collectionName = checkString(collectionName);
    collectionImageUrl = checkString(collectionImageUrl);

    let newCollection = {
        collectionName: collectionName,
        collectionImageUrl: collectionImageUrl,
        figureList: []
    };

    const figureCollections = await collections();
    const insertInfo = await figureCollections.insertOne(newCollection);

    if(!insertInfo.acknowledged || !insertInfo.insertedId){
        throw new Error("Could not add collection");
    }

    const newId = insertInfo.insertedId.toString();
    const figColl = await getCollectionById(newId);

    return figColl;
};

const getAllCollections = async () => {
    const figureCollections = await collections();
    let collectionList = await figureCollections
        .find({})
        .project({_id:1, collectionName:1})
        .toArray();

    if (!collectionList){
        throw new Error("Could not get all the collections");
    }

    collectionList = collectionList.map((col) =>{
        col._id = team._id.toString();
        return col;
    });

    return collectionList;
};

const getCollectionById = async (collectionId) => {
    
    collectionId = checkString(collectionId);
    checkId(collectionId);

    const figureCollections = await collections();
    const figColl = await figureCollections.findOne(
        {_id: ObjectId.createFromHexString(collectionId)}
    );
    if( figColl === null){
        throw new Error("No collection with that id");
    }
    figColl._id = figColl._id.toString();
    return figColl;
};


// Only Updating the Name or ImageUrl 
const updateCollection = async(collectionId, updateObject) =>{
    collectionId = checkString(collectionId);
    checkId(collectionId);

    if (updateObject == undefined) {
		throw new Error("updateObject is undefined");
	}

	if (typeof updateObject !== "object") {
		throw new Error("updateObject is not an object");
	}
    

    if(updateObject.collectionName){
        updateObject.collectionName = checkString(updateObject.collectionName);

    }

    if(updateObject.collectionImageUrl){
        updateObject.collectionImageUrl = checkString(updateObject.collectionImageUrl);
    }


    const figureCollection = await collections();
    let coll = await figureCollection.findOneAndUpdate(
        {_id: ObjectId.createFromHexString(collectionId)},
        {$set: updateObject},
        {returnDocument: 'after'}
    );

    if(!coll){
        throw new Error("could not update collection successfully");
    }

    return coll;

};

const removeCollection = async(collectionId) =>{
    collectionId = checkString(collectionId);
	id = id.trim();
    checkId(collectionId);

	const figureCollections = await collections();
	const deletionInfo = await figureCollections.findOneAndDelete({
		_id: ObjectId.createFromHexString(id)
	})

	if (!deletionInfo) {
		throw `Could not delete collection with id of ${id}`;
	}

	return {_id: id, deleted: true};
};

export {createCollection, getAllCollections, getCollectionById, updateCollection, removeCollection};