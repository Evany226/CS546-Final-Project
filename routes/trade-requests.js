import { Router } from "express";
import { checkDate, checkTransactionStatus, checkId } from "../helpers.js";
import {
  createTradeRequest,
  getTradeRequestById,
  getTradeRequestsByUser,
  removeTradeRequest,
  updateTradeRequest,
} from "../data/tradeRequests.js";
import { getUserById } from "../data/users.js";
import { getFigureById } from "../data/figures.js";
import { checkAuthenticated } from "../middleware.js";
import { tradeRequests } from "../config/mongoCollections.js";
import { getListingByTradeRequest } from "../data/listings.js";

const router = Router();

router.route("/").get(async (req, res) => {
  try {
    const user = req.session.user;
    const tradeRequestIdList = await getTradeRequestsByUser(
      /*user._id*/ "676085046167047f749f217e"
    );

    const tradeRequestList = [];

    tradeRequestIdList.forEach(async (tradeRequest) => {
      try {
        tradeRequest = await getTradeRequestById(tradeRequest);

        const fromUser = await getUserById(
          /*tradeRequest.fromUser*/ "676085046167047f749f217e"
        );
        tradeRequest.username = fromUser.username;

        const listingFigure = await getFigureById(
          /*tradeRequest.listingFigureId*/ "6760851a6167047f749f218a"
        );

        const offeringFigure = await getFigureById(
          /*tradeRequest.offeringFigureId*/ "6760851a6167047f749f218b"
        );

        tradeRequest.listingFigureImageUrl = listingFigure.figureImageUrl;
        tradeRequest.offeringFigureImageUrl = offeringFigure.figureImageUrl;

        tradeRequestList.push(tradeRequest);
      } catch (error) {
        return res.status(400).render("tradeRequests", { error: e.message });
      }
    });

    return res.render("tradeRequests", {
      title: "trade-requests",
      tradeRequest: tradeRequestList,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).render("tradeRequests", { error: e.message });
  }
});

router
  .route("/:tradeRequestId")
  // .get(async (req, res) => {
  //   let { tradeRequestId } = req.params;
  //   console.log(tradeRequestId);

  //   try {
  //     tradeRequestId = checkId(tradeRequestId);
  //   } catch (e) {
  //     console.log(e);
  //     return res.status(400).render(`getTradeRequest`, { error: e.message });
  //   }
  //   try {
  //     const tradeRequest = await getTradeRequestById(tradeRequestId);
  //     const toUser = await getUserById(
  //       /*tradeRequest.toUserId*/ "676085046167047f749f217e"
  //     );
  //     const fromUser = await getUserById(
  //       /*tradeRequest.fromUserId*/ "676085046167047f749f217e"
  //     );
  //     const transactionStatus = tradeRequest.transactionStatus;
  //     const listingFigure = await getFigureById(
  //       /*tradeRequest.listingFigureId*/ "674f6d9b92f33f3870646ad4"
  //     );
  //     const offerFigure = await getFigureById(
  //       /*tradeRequest.offeringFigureId*/ "674f6d9b92f33f3870646ad5"
  //     );
  //     const date = tradeRequest.date;
  //     const listingId = tradeRequest.listingId;

  //     return res.render(`getTradeRequest`, {
  //       toUser: toUser,
  //       fromUser: fromUser,
  //       transactionStatus: transactionStatus,
  //       listingFigure: listingFigure,
  //       offerFigure: offerFigure,
  //       date: date,
  //       listingId: /*listingId*/ "6760851a6167047f749f2190",
  //     });
  //   } catch (e) {
  //     console.log(e);
  //     return res.status(500).render(`getTradeRequest`, { error: e.message });
  //   }
  // })
  // .put(async (req, res) => {
  //   let { tradeRequestId } = req.params;
  //   try {
  //     tradeRequestId = checkId(tradeRequestId);
  //   } catch (e) {
  //     return res
  //       .status(400)
  //       .redirect(`/getTradeRequest/${tradeRequestId}`, { error: e.message });
  //   }

  //   const updatedData = req.body;
  //   if (!updatedData || Object.keys(updatedData).length === 0) {
  //     return res.status(400).redirect(`/getTradeRequest/${tradeRequestId}`, {
  //       error: "No request body",
  //     });
  //   }

  //   const updatedDataKeys = Object.keys(objectData);

  //   try {
  //     if (updatedDataKeys.includes("listingId")) {
  //       updatedData.listingId = checkId(updatedData.listingId);
  //     }

  //     if (updatedDataKeys.includes("listingFigureId")) {
  //       updatedData.listingFigureId = checkId(updatedData.listingFigureId);
  //     }

  //     if (updatedDataKeys.includes("offeringFigureId")) {
  //       updatedData.offeringFigureId = checkId(updatedData.offeringFigureId);
  //     }

  //     if (updatedDataKeys.includes("toUserId")) {
  //       updatedData.toUserId = checkId(updatedData.toUserId);
  //     }

  //     if (updatedDataKeys.includes("fromUserId")) {
  //       updatedData.fromUserId = checkId(updatedData.fromUserId);
  //     }

  //     if (updatedDataKeys.includes("transactionStatus")) {
  //       updatedData.transactionStatus = checkTransactionStatus(
  //         updatedData.transactionStatus
  //       );
  //     }

  //     if (updatedDataKeys.includes("completionStatus")) {
  //       if (typeof completionStatus !== "boolean")
  //         throw new Error("completionStatus must be type boolean");
  //     }

  //     if (updatedDataKeys.includes("date")) {
  //       updatedData.date = checkDate(updatedData.date, "date");
  //     }
  //   } catch (e) {
  //     return res
  //       .status(400)
  //       .redirect(`/getTradeRequest/${tradeRequestId}`, { error: e.message });
  //   }

  //   try {
  //     const updatedTradeRequest = await updateTradeRequest(
  //       tradeRequestId,
  //       updatedData
  //     );
  //     res.redirect(`/getTradeRequest/${tradeRequestId}`);
  //   } catch (e) {
  //     return res
  //       .status(500)
  //       .redirect(`/getTradeRequest/${tradeRequestId}`, { error: e.message });
  //   }
  // })
  .delete(async (req, res) => {
    return res.redirect("/profile");
    // const { tradeRequestId } = req.params;
    // try {
    //   tradeRequestId = checkId(tradeRequestId);
    // } catch (e) {
    //   return res.status(400).render(`tradeRequests`, { error: e.message });
    // }

    // try {
    //   let deletedTradeRequest = await removeTradeRequest(tradeRequestId);
    //   res.render("tradeRequests");
    // } catch (e) {
    //   return res.status(400).render(`tradeRequests`, { error: e.message });
    // }
  });
export default router;
