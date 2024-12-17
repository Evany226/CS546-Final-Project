import {ObjectId, ReturnDocument} from "mongodb";
import { collections } from "../config/mongoCollections.js";
import { checkId, checkString } from "../helpers.js";

/**
 * This is the Collections document to create a category for the figures
 */



/** 
 * Create Figure Collection
 * inputs are name and image url
 * figures are added after
 */
const createCollection = async (
    collectionName,
    collectionImageUrl
) => {

    collectionName = checkString(collectionName, "collectionName");
    collectionImageUrl = checkString(collectionImageUrl, "collectionImageUrl");

    if(collectionName.length > 20){
        throw new Error("Collection name exceeds character limit, 20 characters max")
    }

    let newCollection = {
        collectionName: collectionName,
        collectionImageUrl: collectionImageUrl,
        figures: []
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


// Returns collection and figure data
const getAllCollections = async () => {
    const figureCollections = await collections();
    let collectionList = await figureCollections
        .find({})
        .project({_id:1, collectionName:1, collectionImageUrl:1, figures:1})
        .toArray();

    if (!collectionList){
        throw new Error("Could not get all the collections");
    }

    collectionList = collectionList.map((col) =>{
        col._id = col._id.toString();
        col.figures.map((fig =>{
            fig._id = fig._id.toString();
            return fig;
        }))
        return col;
    });

    return collectionList;
};

const getCollectionById = async (collectionId) => {
    
    collectionId = checkString(collectionId, "collectionId");
    collectionId = checkId(collectionId);

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
    collectionId = checkString(collectionId, "collectionId");
    collectionId = checkId(collectionId);

    if (updateObject == undefined) {
		throw new Error("updateObject is undefined");
	}

	if (typeof updateObject !== "object") {
		throw new Error("updateObject is not an object");
	}
    

    if(updateObject.collectionName){
        if(updateObject.collectionName.length > 20){
            throw new Error("Collection name exceeds character limit, 20 characters max")
        }
        updateObject.collectionName = checkString(updateObject.collectionName, "collectionName");

    }

    if(updateObject.collectionImageUrl){
        updateObject.collectionImageUrl = checkString(updateObject.collectionImageUrl, "collectionImageUrl");
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
    collectionId = checkString(collectionId, "collectionId");
    collectionId = checkId(collectionId);

	const figureCollections = await collections();
	const deletionInfo = await figureCollections.findOneAndDelete({
		_id: ObjectId.createFromHexString(collectionId)
	})

	if (!deletionInfo) {
		throw `Could not delete collection with id of ${collectionId}`;
	}

	return {_id: collectionId, deleted: true};
};

export {createCollection, getAllCollections, getCollectionById, updateCollection, removeCollection};