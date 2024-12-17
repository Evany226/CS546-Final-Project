import { Router } from "express";
import { checkAuthenticated } from "../middleware.js";
import { createTracker, getTrackersByUserId, getUserTrackerForCol, updateTracker } from "../data/tracker.js";
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

router.post("/update", checkAuthenticated, async(req, res) => {
    let incoming_trackers = req.body;
    incoming_trackers.forEach(elem => {
        elem.figureList = elem.figureList.map(figure => {
            return JSON.parse(figure);
        });
    });
    let user = req.session.user;
    if (incoming_trackers.length === 0) {
        return res.status(400).json({error: "No trackers!"});
    }
    try {
        incoming_trackers.forEach(async (inc) => {
            let inc_figurelist = inc.figureList;
            let tracker = await getUserTrackerForCol(user._id, inc.collectionId);
            tracker.figureList.forEach((figure) => {
                figure.owned = inc_figurelist.find(item => item._id === figure._id.toString()).owned;
            });
            await updateTracker(tracker._id.toString(), tracker);
            console.log("here");
        });
    } catch (e) {
        return res.status(400).json({error: `${e}`});
    }
    
})
export default router;