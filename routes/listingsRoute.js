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
import { getCollectionById } from "../data/collections.js";
import { getFigureById } from "../data/figures.js";
import { getUserById } from "../data/users.js";

router
  .route("/")
  .get(async (req, res) => {
    try {
      const listingList = await getAllListings();

      console.log(listingList);
      res.render("listings", {
        title: "Listings",
        listing: listingList,
      });
    } catch (e) {
      return res.status(400).render("listings", { error: e.message });
    }
  })
  .post(async (req, res) => {
    const listingData = req.body;

    if (!listingData || Object.keys(listingData).length === 0) {
      return res.status(400).render("listings", { error: "No request body" });
    }

    let {
      userId,
      collectionId,
      listingFigureId,
      offeringFigureId,
      description,
      condition,
      commentIds,
      tradeRequestsIds,
      status,
    } = listingData;

    try {
      userId = checkId(userId);
      collectionId = checkId(collectionId);
      listingFigureId = checkId(listingFigureId);

      offeringFigureId.forEach((figure) => {
        figure = checkId(figure);
      });

      description = checkString(description, "description");

      condition = checkCondition(condition);

      commentIds.forEach((comment) => {
        comment = checkId(comment);
      });

      tradeRequestsIds.forEach((tradeRequests) => {
        tradeRequests = checkId(tradeRequests);
      });

      status = checkListingStatus(status);
    } catch (e) {
      return res.status(400).render("listings", { error: e.message });
    }

    try {
      const newListing = await createListing(
        userId,
        collectionId,
        listingFigureId,
        offeringFigureId,
        description,
        condition,
        commentIds,
        tradeRequestsIds,
        status
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

    try {
      listingId = checkId(listingId);
    } catch (e) {
      return res.status(400).render(`getListing`, { error: e.message });
    }

    try {
      const listing = await getListingById(listingId);
      console.log(listing);
      const user = await getUserById(listing.userId);
      console.log("g");
      console.log(listing);
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
      });
    } catch (e) {
      console.log(e);
      return res.status(500).render(`getListing`, { error: e.message });
    }
  })
  .put(async (req, res) => {
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

      if (updatedDataKeys.includes("userId")) {
        updatedData.userId = checkId(updatedData.userId);
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
