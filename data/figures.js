import { ObjectId } from "mongodb";
import { checkId, checkString } from "../helper.js";
import { collections } from "../config/mongoCollections.js";
import { getCollectionById, updateCollection } from "./collections.js";

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
   
    collectionId = checkString(collectionId);
    checkId(collectionId);

    if(typeof figureObj !== "object"){
        throw new Error("figureList contains an element that is not an object");
    }
    if(Object.keys(figureObj).length < 2){
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

	const figCollection = await getCollectionById(collectionId);

	if (!figCollection) {
		throw new Error("Team does not exist");
	}

	return figCollection.figures;
};

const getFigureById = async(figureId) =>{
    figureId = checkString(figureId);
    checkId(figureId);

    const figCollection = await collections();

    const col = await figCollection.findOne(
        {'figures._id': ObjectId.createFromHexString(figureId)},
        { projection: { _id: 0, 'figures.$': 1 }}
    );

    if(col === null) throw 'Figure does not exist';

    return col.figures[0];
};

const updateFigure = async (figureId, updateObject) =>{
    figureId = checkString(figureId);
    checkId(figureId);

    if (updateObject == undefined) {
		throw new Error("updateObject is undefined");
	}

	if (typeof updateObject !== "object") {
		throw new Error("updateObject is not an object");
	}
    
    let originFig = await getFigureById(figureId);

    if(updateObject.figureName){
        updateObject.figureName = checkString(updateObject.figureName);
        originFig.figureName = updateObject.figureName;
    }

    if(updateObject.figureImageUrl){
        updateObject.figureImageUrl = checkString(updateObject.figureImageUrl);
        originFig.figureImageUrl = updateObject.figureImageUrl;
    }

    

    const figureCollection = await collections();
    let coll = await figureCollection.findOneAndUpdate(
        {'figures._id': ObjectId.createFromHexString(figureId)},
        {$set: {"figures.$": originFig}},
        {returnDocument: 'after'}
    );

    if(!coll){
        throw new Error("could not update figure successfully");
    }

    return coll;
};

const removeFigure = async (figureId) =>{
    figureId = checkString(figureId);
    checkId(figureId);

    const figureCollection = await collections();
    let updateInfo = await figureCollection.findOneAndUpdate(
        {'figures._id': ObjectId.createFromHexString(figureId)},
        {$pull: {figures: {_id: ObjectId.createFromHexString(figureId)}}},
        {returnDocument: 'after'}
    );

    if(!updateInfo){
        throw new Error("could remove figure successfully");
    }

    return updateInfo;

};

export {createFigureList, addFigure, getAllFigures, getFigureById, updateFigure, removeFigure};