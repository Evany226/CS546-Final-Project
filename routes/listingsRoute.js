import { Router } from "express";

const router = Router();
import {
  checkString,
  checkId,
  checkObject,
  checkCondition,
  checkListingStatus,
} from "../helpers.js";
import {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  removeListing,
} from "../data/listings.js";
import { getCollectionById, getAllCollections } from "../data/collections.js";
import { getFigureById } from "../data/figures.js";
import { getUserById } from "../data/users.js";
import { createTradeRequest } from "../data/tradeRequests.js";
import { checkAuthenticated } from "../middleware.js";

router
  .route("/")
  .get(async (req, res) => {
    try {
      const listingList = await getAllListings();

      const collections = await getAllCollections();

      res.render("listings", {
        title: "Listings",
        listing: listingList,
        collections: collections,
      });
    } catch (e) {
      return res.status(400).render("listings", { error: e.message });
    }
  })
  .post(checkAuthenticated, async (req, res) => {
    const listingData = req.body;
    const user = req.session.user;
    const userId = user._id;
    const collections = await getAllCollections();
    if (!listingData || Object.keys(listingData).length === 0) {
      return res.status(400).render("listings", { error: "No request body" });
    }

    let {
      listingName,
      collectionId,
      listingFigureId,
      offeringFigureId,
      description,
      condition,
    } = listingData;

    const offeringFigureIdList = [offeringFigureId];

    try {
      collectionId = checkId(collectionId);
      listingFigureId = checkId(listingFigureId);

      offeringFigureIdList.forEach((figure) => {
        figure = checkId(figure);
      });

      description = checkString(description, "description");

      condition = condition.toLowerCase();
      condition = checkCondition(condition);
    } catch (e) {
      return res.status(400).render("listings", { error: e.message });
    }

    try {
      const newListing = await createListing(
        listingName,
        userId,
        collectionId,
        listingFigureId,
        offeringFigureIdList,
        description,
        condition,
        [],
        [],
        "Open"
      );
    } catch (e) {
      return res
        .status(500)
        .render("listings", { error: "Internal Server Error" });
    }
  });

router
  .route("/getListing/:listingId")
  .get(async (req, res) => {
    let { listingId } = req.params;
    let currentUser = req.session.user;
    if (currentUser) {
      currentUser = currentUser._id;
    }
    try {
      listingId = checkId(listingId);
    } catch (e) {
      return res
        .status(400)
        .redirect(`/getListing/${listingId}`, { error: e.message });
    }

    try {
      const listing = await getListingById(listingId);

      const user = await getUserById(listing.userId);

      let userCheck;
      if (!currentUser) {
        userCheck = false;
      } else if (listing.userId === currentUser) {
        userCheck = true;
      } else {
        userCheck = false;
      }

      const collection = await getCollectionById(listing.collectionId);
      const listingFigure = await getFigureById(listing.listingFigureId);

      const offerFigureList = [];

      listing.offerFigureId.forEach(async (figureId) => {
        const figure = await getFigureById(figureId);
        offerFigureList.push(figure);
      });

      const commentIdsList = [];

      listing.commentIds.forEach(async (commentId) => {
        const comment = await getCommentById(commentId);
        comment[username] = await getUserById(comment.userId);
        commentIdsList.push(comment);
      });

      return res.render(`getListing`, {
        listingName: listing.listingName,
        username: user.username,
        collectionName: collection.collectionName,
        collectionId: collection._id,
        listingFigureName: listingFigure.figureName,
        listingFigureImageUrl: listingFigure.figureImageUrl,
        listingFigureId: listingFigure._id,
        offeringFigure: offerFigureList,
        description: listing.description,
        condition: listing.condition,
        comment: commentIdsList,
        tradeRequestsIds: listing.tradeRequestsIds,
        status: listing.status,
        userCheck: userCheck,
      });
    } catch (e) {
      return res
        .status(500)
        .redirect(`/getListing/${listingId}`, { error: e.message });
    }
  })
  .post(checkAuthenticated, async (req, res) => {
    let { listingId } = req.params;
    try {
      listingId = checkId(listingId);
    } catch (e) {
      return res
        .status(400)
        .redirect(`/getListing/${listingId}`, { error: e.message });
    }
    console.log("working");

    const tradeRequestData = req.body;
    if (!tradeRequestData || Object.keys(tradeRequestData).length === 0) {
      return res
        .status(400)
        .redirect(`/getListing/${listingId}`, { error: e.message });
    }

    let { offeringFigureId } = tradeRequestData;
    const toUserId = await getUserById(listing.userId);
    const fromUserId = req.session.user;
    const listing = await getListingById(listingId);
    const listingFigureId = listing.listingFigureId;
    const transactionStatus = "pending";
    const completionStatus = "false";
    const date = new Date();
    console.log("working2");
    try {
      offeringFigureId = checkId(offeringFigureId);
    } catch (e) {
      return res
        .status(400)
        .redirect(`/getListing/${listingId}`, { error: e.message });
    }

    try {
      const newtradeRequest = await createTradeRequest(
        listingId,
        listingFigureId,
        offeringFigureId,
        toUserId,
        fromUserId,
        transactionStatus,
        completionStatus,
        date
      );
    } catch (e) {
      return res.status(500).redirect(`/getListing/${listingId}`, {
        error: "Internal Server Error",
      });
    }
  })
  .put(checkAuthenticated, async (req, res) => {
    let { listingId } = req.params;
    try {
      listingId = checkId(listingId);
    } catch (e) {
      return res
        .status(400)
        .redirect(`/getListing/${listingId}`, { error: e.message });
    }

    const updatedData = req.body;
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return res
        .status(400)
        .redirect(`/getListing/${listingId}`, { error: "No request body" });
    }

    const updatedDataKeys = Object.keys(objectData);

    try {
      if (updatedDataKeys.includes("listingName")) {
        updatedData.listingName = checkString(
          updatedData.listingName,
          "listingName"
        );
      }

      if (updatedDataKeys.includes("collectionId")) {
        updatedData.collectionId = checkId(updatedData.collectionId);
      }

      if (updatedDataKeys.includes("listingFigureId")) {
        updatedData.listingFigureId = checkId(updatedData.listingFigureId);
      }

      if (updatedDataKeys.includes("offeringFigureId")) {
        updatedData.offeringFigureId.forEach((figure) => {
          figure = checkId(figure);
        });
      }

      if (updatedDataKeys.includes("description")) {
        updatedData.description = checkString(
          updatedData.description,
          "description"
        );
      }

      if (updatedDataKeys.includes("condition")) {
        updatedData.condition = checkCondition(updatedData.condition);
      }

      if (updatedDataKeys.includes("commentIds")) {
        updatedData.commentIds.forEach((comment) => {
          comment = checkId(comment);
        });
      }

      if (updatedDataKeys.includes("status")) {
        updatedData.status = checkListingStatus(updatedData.status);
      }
    } catch (e) {
      return res
        .status(400)
        .redirect(`/getListing/${listingId}`, { error: e.message });
    }

    try {
      const updatedList = await updateListing(listingId, updatedData);
      res.redirect(`/getListing/${listingId}`);
    } catch (e) {
      return res
        .status(500)
        .redirect(`/getListing/${listingId}`, { error: e.message });
    }
  })
  .delete(async (req, res) => {
    const { listingId } = req.params;
    try {
      listingId = checkId(listingId);
    } catch (e) {
      return res
        .status(400)
        .redirect(`/getListing/${listingId}`, { error: e.message });
    }

    try {
      let deletedListing = await removeListing(listingId);
      res.redirect("/listings");
    } catch (e) {
      return res
        .status(400)
        .redirect(`/getListing/${listingId}`, { error: e.message });
    }
  });

export default router;
