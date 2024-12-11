import { Router } from "express";

const router = Router();
import { checkString, checkId, checkObject, checkCondition, checkStatus } from "../helpers.js";
import {createListing, getAllListings, getListingById, updateListing, removeListing} from "../data/listings.js";

router
  .route('/')
  .get(async (req, res) => {
    try{
      const listingList = await getAllListings();
      console.log(listingList);
      res.render("listings", {
        title: "Listings",
        listing: listingList
        });
    } catch(e) {
      return res
        .status(400)
        .render("listings", {error: e.message})
    }
  })
  .post(async (req, res) => {
    const listingData = req.body;
    
    if (!listingData || Object.keys(listingData).length === 0) {
      return res
      .status(400)
      .render("listings", {error: "No request body"})
    }

    let {
      userId,
      collectionId,
      offerFigureId,
      requestFigureId,
      description,
      condition,
      commentIds,
      tradeRequestsId,
      status
    } = listingData;

    try {
      userId = checkId(userId);
      collectionId = checkId(collectionId);
      offerFigureId = checkId(offerFigureId);
  
      requestFigureId.forEach( (figure) => {
          figure = checkId(figure);
      })
  
      description = checkString(description, 'description');
  
      condition = checkCondition(condition);
  
      commentIds.forEach( (comment) => {
          comment = checkId(comment);
      })
  
      tradeRequestsId.forEach( (tradeRequests) => {
          tradeRequests = checkId(tradeRequests);
      })
  
      status = checkStatus(status);
    } catch(e) {
      return res
        .status(400)
        .render("listings", {error: e.message})
    } 

    try{
      const newListing = await createListing(
        userId,
        collectionId,
        offerFigureId,
        requestFigureId,
        description,
        condition,
        commentIds,
        tradeRequestsId,
        status);      
    } catch(e) {
      return res
        .status(500)
        .render("listings", {error: "Internal Server Error"})
    }
  });

router
  .route('/:listingId')
  .get(async (req, res) => {
    let{listingId} = req.params;

    try{
      listingId = checkId(listingId);
    } catch(e) {
      return res
        .status(400)
        .render(`listing/${listingId}`, {error: e.message})
    }

    try{
      const listing = await getListingById(listingId);
      return res.render(`listing/${listingId}`, {
        title: `${listing.listingName}`,
        userId: listing.userId,
        collectionId: listing.collectionId,
        offerFigureId: listing.offerFigureId,
        requestFigureId: listing.requestFigureId,
        description: listing.description,
        condition: listing.condition,
        commentIds: listing.commentIds,
        tradeRequestsId: listing.tradeRequestsId,
        status: listing.status
      });
    } catch(e) {
      return res
        .status(500)
        .render(`listing/${listingId}`, {error: e.message})
    }
  })
  .put(async (req,res) => {
    let{listingId} = req.params;
    try{
      listingId = checkId(listingId);
    } catch(e) {
      return res
        .status(400)
        .render(`listings/${listingId}/update`, {error: e.message})
    }

    const updatedData = req.body;
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return res
      .status(400)
      .render(`listings/${listingId}/update`, {error: "No request body"})
    }

    const updatedDataKeys = Object.keys(objectData)

    try{
      if (updatedDataKeys.includes('listingName')) {
        updatedData.listingName = checkString(updatedData.listingName, 'listingName');
      }

      if (updatedDataKeys.includes('userId')) {
          updatedData.userId = checkId(updatedData.userId);
      }
      
      if (updatedDataKeys.includes('collectionId')) {
          updatedData.collectionId = checkId(updatedData.collectionId);
      }

      if (updatedDataKeys.includes('offerFigureId')) {
          updatedData.offerFigureId = checkId(updatedData.offerFigureId);
      }

      if (updatedDataKeys.includes('requestFigureId')) {
          updatedData.requestFigureId.forEach( (figure) => {
              figure = checkId(figure);
          })
      }

      if (updatedDataKeys.includes('description')) {
          updatedData.description = checkString(updatedData.description, 'description');
      }

      if (updatedDataKeys.includes('condition')) {
          updatedData.condition = checkCondition(updatedData.condition);
      }

      if (updatedDataKeys.includes('commentIds')) {
          updatedData.commentIds.forEach( (comment) => {
              comment = checkId(comment);
          })
      }

      if (updatedDataKeys.includes('tradeRequestsId')) {
          updatedData.tradeRequestsId.forEach( (tradeRequests) => {
              tradeRequests = checkId(tradeRequests);
          })
      }

      if (updatedDataKeys.includes('status')) {
          updatedData.status = checkStatus(updatedData.status);
      }      
    } catch(e) {
      return res
        .status(400)
        .render(`listings/${listingId}/update`, {error: e.message})
    } 

    try {
      const updatedList = await updateListing(listingId, updatedData);
      res.redirect(`listings/${listingId}`)
    } catch(e) {
      return res
        .status(500)
        .render(`listings/${listingId}/update`, {error: e.message})
    }
  })
  .delete(async (req, res) => {
    const{listingId} = req.params;
    try {
      listingId = checkId(listingId)
    } catch(e) {
      return res
        .status(400)
        .render(`listings/${listingId}/delete`, {error: e.message})
    }

    try{
      let deletedListing = await deletedListing(listingId);
      res.redirect('/listings')
    } catch(e) {
      return res
        .status(400)
        .render(`listings/${listingId}/delete`, {error: e.message})
    }
  })

export default router;
