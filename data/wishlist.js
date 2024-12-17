import { ObjectId } from "mongodb";
import { users, listings } from "../config/mongoCollections.js";
import { getUserById } from "./users.js";
import { getListingById } from "./listings.js";
import { checkId } from "../helpers.js"

const addToWishlist = async (userId, givenFigureId) => {
    userId = checkId(userId);
    givenFigureId = checkId(givenFigureId);
    const listingCollection = await listings();
    const userCollection = await users();
    const user = await getUserById(userId);
    let figureListings = await listingCollection.distinct("_id");
    figureListings = figureListings.filter(x => x._id == givenFigureId);
    let newWishlist = user.wishlist;
    let alreadyAdded = newWishlist.filter(x => x.figureId == givenFigureId);
    if(alreadyAdded.length > 0) return "Figure already in wishlist";
    let newItem = {
        figureId: givenFigureId,
        listings: figureListings,
    }
    newWishlist.push(newItem);
    await userCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { wishlist: newWishlist }}
    );
    console.log(await getUserById(userId))
    return "Added to Wish List";
};

const removeFromWishlist = async (userId, givenFigureId) => {
    userId = checkId(userId);
    givenFigureId = checkId(givenFigureId);
    const userCollection = await users();
    let newWishlist = user.wishlist;
    let deletionInfo = newWishlist.findOneAndDelete(x => x.figureId == givenFigureId);
    await userCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { wishlist: newWishlist} }
    );
    
    if (!deletionInfo)
        throw new Error(
          `Could not delete item from wishlist with id of ${figureId}`
        );
    
    return deletionInfo;
};



export { addToWishlist, removeFromWishlist };