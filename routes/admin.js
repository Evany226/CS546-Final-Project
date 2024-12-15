import { Router } from "express";
import { checkAdmin } from "../middleware.js";
import { collections } from "../config/mongoCollections.js";

const router = Router();

router.get("/", checkAdmin, async (req, res) => {
    return res.render("admin", {partial: "admin_script"});
});

router.post("/add-collection", checkAdmin, async (req, res) => {
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({error: "There are no fields in the request body"});
    }
    /*
    * req json
    * {
    *   collectionName,
    *   figures: [{name, imageurl}]
    * }
    */
   let figures = []
   data.figures.forEach((figure) => {
        figures.push({
            _id: new ObjectId(),
            figureName: figure.name,
            figureImageUrl: figure.imageUrl
        });
   });
   let collections_col = await collections();
   let new_collection = {
        collectionName: req.body.collectionName,
        figures: figures
   }
   let insertion_info = collections_col.insertOne(new_collection);
   if (!insertion_info.acknowledged || !insertion_info.insertedId) {
    throw new Error("Could not add the collection!");
   }
   const newId = insertion_info.insertedId.toString();

   return newId;
});

export default router;