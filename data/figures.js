import { ObjectId } from "mongodb";
import { checkString } from "../helpers.js";
import { teams } from "../config/mongoCollections.js";
import { getCollectionById } from "./collections.js";

/**
 * This is the Subdocument of collections
 */

const createFigure = async (figureName, figureImageUrl) =>{


};

const getAllFigures = async (collectionId) =>{

};

const getFigureById = async(figureId) =>{

};

const updateFigure = async (figureId, updateObject) =>{

};

const removeFigure = async (figureId) =>{

};

export {createFigure, getAllFigures, getFigureById, updateFigure, removeFigure};