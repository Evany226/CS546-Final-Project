import {ObjectId} from "mongodb";
import { collections } from "../config/mongoCollections.js";
import { checkString } from "../helper.js";

/**
 * This is the Collections document to create a 
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

};

const getAllCollections = async () => {

};

const getCollectionById = async (collectId) =>{

};

const updateCollection = async(collectionId, updateObject) =>{

};

const removeCollection = async() =>{

};

export {createCollection, getAllCollections, getCollectionById, updateCollection, removeCollection};