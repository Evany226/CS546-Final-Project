import { Router } from "express";
import { checkAuthenticated } from "../middleware.js";
import { createTracker, getTrackersByUserId } from "../data/tracker.js";
import { getAllCollections } from "../data/collections.js";

const router = Router();

// mostly just for json information to load the tracker page

router.get("/", checkAuthenticated, async(req, res) => {

    try {
        let collections = await getAllCollections();
        let trackers = await getTrackersByUserId(req.session.user._id);
        res.render("tracker", {collections: collections, partial: "tracker_script", trackers: trackers});
    } catch(e) {
        res.json({error: `${e}`});
    }
    
});

router.get("/get", checkAuthenticated, async(req, res) => {
    try {
      let trackers = await getTrackersByUserId(req.session.user._id);
      return res.json(trackers);
    } catch(e) {
      return res.json({error: `${e}`});
    }
});



router.post("/create/:id", checkAuthenticated, async(req, res) => {
    try {
        let result = await createTracker(req.session.user._id, req.params.id);
        res.json({acknowledged: true});
    } catch(e) {
        return res.status(400).json({error: `${e}`});
    }
 });

export default router;