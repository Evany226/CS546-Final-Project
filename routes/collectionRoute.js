import { Router } from "express";
const router = Router();
import { addToWishlist, removeFromWishlist } from "../data/wishlist.js";
import { collectionData, figureData } from "../data/index.js";
import { checkString, checkId } from "../helpers.js";
import { Collection } from "mongodb";

router.route("/collection").get(async (req, res) => {
  try {
    let collectionList = await collectionData.getAllCollections();
    console.log("collectionList", collectionList);
    res.render("collections", {
      title: "Collection",
      collection: collectionList,
      //user: req.session.user,
    });
  } catch (e) {
    console.log(e);
    res.status(400).render("collections");
  }
}).post(async (req, res) => {
  console.log(req.session)
  let userId = req.session.user._id
  let figureId = req.body.figure;
  try {
    figureId = checkId(figureId);
    userId = checkId(userId);
    console.log(await addToWishlist(userId, figureId))
  } catch (e) {
    return res
      .status(400)
      .redirect('/collection');
  }
});

export default router;
