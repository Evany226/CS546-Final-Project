import {ObjectId} from "mongodb";
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
    collectionImageUrl,
    figureList
) => {

    collectionName = checkString(collectionName);
    collectionImageUrl = checkString(collectionImageUrl);

    figureList.forEach(figure => {
        if(typeof figure !== "object"){
            throw new Error("Content of figureList are not all objects");
        }

        if(Object.keys(figure).length < 2){
            throw new Error("Figure Object missing information")
        }
    });

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

};

const getCollectionById = async (collectionId) => {
    
    collectionId = checkString(collectionId);
    checkId(collectionId);

    const figureCollections = await collections();
    const figColl = await figureCollections.findOne(
        {_id: ObjectId.createFromHexString(id)}
    );
    if( figColl === null){
        throw new Error("No collection with that id");
    }
    figColl.id = figColl.toString();
    return figColl;
};

const updateCollection = async(collectionId, updateObject) =>{

};

const removeCollection = async() =>{

};

export {createCollection, getAllCollections, getCollectionById, updateCollection, removeCollection};