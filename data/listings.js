import { ObjectId } from "mongodb";
import { checkString } from "../helpers.js";
import { listings } from "../config/mongoCollections.js";
import { getCollectionById } from "./collections.js";

/**
 * Listings
 */

const createListing = async () =>{


};

const getAllListings = async () =>{

};

const getListingById = async(ListingId) =>{

};

const updateListing = async (ListingId, updateObject) =>{

};

const removeListing = async (ListingId) =>{

};

export {createListing, getAllListings, getListingById, updateListing, removeListing};