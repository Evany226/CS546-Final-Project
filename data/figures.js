import { ObjectId } from "mongodb";
import { checkId, checkString } from "../helper.js";
import { collections } from "../config/mongoCollections.js";
import { getCollectionById } from "./collections.js";

/**
 * This is the Subdocument of collections
 */

const createFigureList = async (collectionId, figureList) =>{
    if(!Array.isArray(figureList)){
        throw new Error("figureList is not an array");
    }
    collectionId = checkString(collectionId);
    checkId(collectionId);

    figureList.forEach(figureObj => {
        if(typeof figureObj !== "object"){
            throw new Error("figureList contains an element that is not an object");
        }
        if(Object.keys(figureObj).length < 2){
            throw new Error("One of the figures is missing data")
        }
        
        figureObj.figureName = checkString(figureObj.figureName);
        figureObj.figureImageUrl = checkString(figureObj.figureImageUrl);
        figureObj._id = new ObjectId();
    });

    const figureCol = await collections();
    const updateInfo = await figureCol.findOneAndUpdate(
        {_id: ObjectId.createFromHexString(collectionId)},
        {
            $set: {figures: figureList}
        },
        {returnDocument: 'after'}
    );

    if(!updateInfo){
        throw 'could not update collection successfully'
    }

    updateInfo._id = updateInfo._id.toString();
    return updateInfo;
};

const addFigure = async (collectionId, figureObj) =>{
    if(!Array.isArray(figureList)){
        throw new Error("figureList is not an array");
    }
    collectionId = checkString(collectionId);
    checkId(collectionId);

    if(typeof figureObj !== "object"){
        throw new Error("figureList contains an element that is not an object");
    }
    if(Object.keys().length < 2){
        throw new Error("One of the figures is missing data")
    }
    
    figureObj.figureName = checkString(figureObj.figureName);
    figureObj.figureImageUrl = checkString(figureObj.figureImageUrl);
    figureObj._id = new ObjectId();

    const figureCol = await collections();
    const updateInfo = await figureCol.findOneAndUpdate(
        {_id: ObjectId.createFromHexString(collectionId)},
        {
            $push: {figures: figureObj}
        },
        {returnDocument: 'after'}
    );

    if(!updateInfo){
        throw 'could not update collection successfully'
    }

    updateInfo._id = updateInfo._id.toString();
    return updateInfo;
};

const getAllFigures = async (collectionId) =>{
    collectionId = checkString(collectionId);
	checkId(collectionId);

	const figColl = await collections();

	let coll = await figColl
		.findOne(
			{ 'figureList._id': ObjectId.createFromHexString(gameId) },
			{ projection: { _id: 0, 'games.$': 1 } }
		);

	if (!game) {
		throw new Error("Game does not exist");
	}

	return game.games[0];
};

const getFigureById = async(figureId) =>{

};

const updateFigure = async (figureId, updateObject) =>{

};

const removeFigure = async (figureId) =>{

};

export {createFigureList, addFigure, getAllFigures, getFigureById, updateFigure, removeFigure};