import { ObjectId } from "mongodb";
import { checkString, checkId, checkObject, checkCondition, checkStatus, checkNumber } from "../helpers.js";
import { comments } from "../config/mongoCollections.js";
import { getCollectionById } from "./collections.js";
import { getListingById } from "./listings.js";


const createComment = async (
    userId,
    review,
    content,
    date,
) => {
    userId = checkId(userId);

    review = checkNumber(review);
    if (review < 1 || review > 5) throw new Error('Review must be a number between 1 and 5');

    content = checkString(content, 'content');
    date = checkDate(date);

    let newComment = {
        userId,
        review,
        content,
        date
    };

    const commentCollection = await comments();
    const insertInfo = await commentCollection.insertOne(newComment);
    if (!insertInfo.insertedId) throw new Error('Could not add listing');

    return insertInfo;
}

const getAllComments = async () => {
    const commentCollection = await comments();
    let commentList = await commentCollection.find({}).toArray();

    if (!commentList) throw new Error('Could not get all comments');

    console.log(commentList);

    return commentList;
};


const getCommentById = async (commentId) =>{
    commentId = checkId(commentId);

    const commentCollection = await comments();
    let commentById = await commentCollection.findOne({_id : new ObjectId(commentId)});

    if (!commentById) throw new Error('No comment found with that id!');

    return commentById;
};


const getCommentsByListing = async (listingId) =>{

    let listingById = checkId(listingId);
    listingById = await getListingById(listingId);
    
    let commentsByListing = listingById['commentIds']
    commentsByListing.forEach( async (comment) => {
        comment = await getCommentById(comment);
    }); 

    if (!commentsByListing) throw new Error(`Could not get all comments from listing ${listingById.listingName}`);

    return commentsByListing;
};

const getCommentsByUser = async (userId) =>{

    let userById = checkId(userId);
    userById = await getuserById(userId);
    
    let commentsByUser = userById['commentIds']
    commentsByUser.forEach( async (comment) => {
        comment = await getCommentById(comment);
    }); 

    if (!commentsByUser) throw new Error(`Could not get all comments from user ${userById.username}`);

    return commentsByUser;
};

const updateComment = async (commentId, updateObject) =>{
    commentId = checkId(commentId);
    updateObject = checkObject(updateObject, 'updateObject');
    const updateObjectKeys = Object.keys(updateObject);
    const updatedComment = await getCommentById(commentId);

    if (updateObjectKeys.includes('userId')) {
        updateObject.userId = checkId(updateObject.userId);
        updatedComment.userId = updateObject.userId;
    }

    if (updateObjectKeys.includes('review')) {
        updateObject.review = checkNumber(updateObject.review);
        if (updateObject.review  < 1 || updateObject.review > 5) throw new Error('Review must be a number between 1 and 5');

        updatedComment.review = updateObject.review;
    }
    
    if (updateObjectKeys.includes('content')) {
        updateObject.content = checkString(updateObject.content, 'content');

        updatedComment.content = updateObject.content;
    }
        
    if (updateObjectKeys.includes('date')) {
        updateObject.date = checkDate(updateObject.date, 'date');

        updatedComment.date = updateObject.date;
    }
   
    const commentCollection = await comments();
    const updatedInfo = await commentCollection.findOneAndUpdate(
        {_id: new ObjectId(commentId)},
        {$set: updatedComment},
        {returnDocument: "after"}
    );
    console.log(updatedInfo);
    if (!updatedInfo) throw new Error(`Could not update comment with id of ${commentId} successfully`);

    return updatedInfo;
};

const removeComment = async (commentId) =>{
    commentId = checkId(commentId);

    const commentCollection = await comments();
    const deletionInfo = await commentCollection.findOneAndDelete({
        _id: new ObjectId(commentId)
    });

    if (!deletionInfo) throw new Error(`Could not delete comment with id of ${commentId}`);

    return deletionInfo;
};

export {createComment, getCommentsByUser, getCommentsByListing, getCommentById, updateComment, removeComment};
