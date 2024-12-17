import { Router } from "express";
import { checkAdmin } from "../middleware.js";
import { collections } from "../config/mongoCollections.js";
import { collectionData, figureData } from "../data/index.js";
import { checkId, checkString } from "../helpers.js";

const router = Router();

router.get("/", checkAdmin, async (req, res) => {
    let collectionList = await collectionData.getAllCollections();


    res.render("admin", {
        collection: collectionList,
        partial: "admin_script"});
});

/// For Collections

router.post("/add-collection", checkAdmin, async (req, res) => {
    try {
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
        let collectionName = data.collectionName;
        let collectionImg = data.collectionImageUrl;

        collectionName = checkString(collectionName, "collectionName");

        if(collectionName.length > 20){
            throw new Error("figureName name exceeds character limit, 20 characters max")
        }
        const newCollection = await collectionData.createCollection(collectionName, collectionImg);

    
        if(!newCollection){
            return res.status(400).json({error: "Something went wrong with adding new Collection"});
        }
    
    
        
        res.redirect("/admin")
    } catch (error) {
        let collectionList = await collectionData.getAllCollections();
        res.render("admin", {
            error: error.toString(),
            collection: collectionList,
            partial: "admin_script"});
        }
});



router.route("/edit-collection/:id")
.get(checkAdmin, async (req, res) =>{

    try {
        if(!req.params.id){
            res.status(404).json({error: "No Id given"})
        }
        let collection = await collectionData.getCollectionById(req.params.id);
        // console.log(collection);
    
        if(!collection){
            res.status(404).json({error: "Cannot find collection"})
        }

        res.render("edit_collection", {
            id: req.params.id,
            name: collection.collectionName,
            partial: "admin_script"
        })
    } catch (error) {
        res.status(400).json({error: error.toString()});
    }
});

router.post("/edit-collection", checkAdmin, async (req, res) =>{
    try {

        const data = req.body;
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({error: "There are no fields in the request body"});
        }

        let updateObj = {};


        if(data.collectionName){
            updateObj.collectionName = checkString(data.collectionName, "collectionName")
            if(data.collectionName.length > 20){
                throw new Error("collection name exceeds character limit, 20 characters max")
            }
        }

        if(data.collectionImageUrl){
            updateObj.collectionImageUrl = checkString(data.collectionImageUrl, "collectionImageUrl")
        }

        let updateFig = await collectionData.updateCollection(data.collectionId, updateObj);
        // console.log(updateFig)

        if(!updateFig){
            return res.status(400).json({error: "Something went wrong with updating collection"});
        }

       res.redirect("/admin")

    } catch (error) {
        let collectionList = await collectionData.getAllCollections();
        res.render("admin", {
            error: error.toString(),
            collection: collectionList,
            partial: "admin_script"
        });
    }
});


router.post("/remove-collection", checkAdmin, async (req, res) =>{
    try {
        let data = req.body;
        let collectionId = checkString(data.collectionId,"collectionId");

        collectionId = checkId(collectionId);

        let deleteColl = await collectionData.removeCollection(collectionId);
        if(!deleteColl){
            res.status(400).json({error: "Could not remove collection"})
        }
        
        res.redirect("/admin")

    } catch (error) {
        let collectionList = await collectionData.getAllCollections();
        res.render("admin", {
            error: error.toString(),
            collection: collectionList,
            partial: "admin_script"
        });
    }
});


///////For Figures

router.route("/edit-figure/:id")
.get(checkAdmin, async (req, res) =>{

    try{
        
        if(!req.params.id){
            res.status(404).json({error: "No Id given"})
        }
        let figure = await figureData.getFigureById(req.params.id);

        if(!figure){
            res.status(404).json({error: "Cannot find figure"})
        }

        res.render("edit_figure", {
            id: req.params.id,
            name: figure.figureName,
            partial: "admin_script"
        })
    }catch(e){
        let collectionList = await collectionData.getAllCollections();
        res.render("admin", {
            error: error.toString(),
            collection: collectionList,
            partial: "admin_script"
        });
        
    }
    
});

router.post("/edit-figure", checkAdmin, async (req, res) =>{
    try {

        const data = req.body;
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({error: "There are no fields in the request body"});
        }

        let updateObj = {};


        if(data.figureName){
            updateObj.figureName = checkString(data.figureName, "figureName");
            if(data.figureName.length > 20){
                throw new Error("figureName name exceeds character limit, 20 characters max")
            }
        }

        if(data.figureImageUrl){
            updateObj.figureImageUrl = checkString(data.figureImageUrl, "figureImageUrl")
        }

        let updateFig = await figureData.updateFigure(data.figureId, updateObj);
        // console.log(updateFig)

        if(!updateFig){
            return res.status(400).json({error: "Something went wrong with updating figure"});
        }

       res.redirect("/admin")

    } catch (error) {
        let collectionList = await collectionData.getAllCollections();
        res.render("admin", {
            error: error.toString(),
            collection: collectionList,
            partial: "admin_script"
        });
        
    }
})





router.route("/add-figure/:id")
.get(checkAdmin, async (req, res) =>{
    res.render("add_figure", {
        id: req.params.id,
        partial: "admin_script"
    })
});

router.post("/add-figure", checkAdmin, async (req, res) =>{
    try {

        const data = req.body;
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({error: "There are no fields in the request body"});
        }

        let figureObj = {};


        if(data.figureName){
            figureObj.figureName = checkString(data.figureName, "figureName")
            if(data.figureName.length > 20){
                throw new Error("figureName name exceeds character limit, 20 characters max")
            }
        }

        if(data.figureImageUrl){
            figureObj.figureImageUrl = checkString(data.figureImageUrl, "figureImageUrl")
        }

        let updateFig = await figureData.addFigure(data.collectionId, figureObj)
        // console.log(updateFig)

        if(!updateFig){
            return res.status(400).json({error: "Something went wrong with updating figure"});
        }

       res.redirect("/admin")

    } catch (error) {
        let collectionList = await collectionData.getAllCollections();
        res.render("admin", {
            error: error.toString(),
            collection: collectionList,
            partial: "admin_script"
        });
        
    }
})



router.post("/remove-figure", checkAdmin, async (req, res) =>{
    try {
        let data = req.body;
        let figureId = checkString(data.figureId,"figureId");

        figureId = checkId(figureId);

        let deleteFig = await figureData.removeFigure(figureId);
        if(!deleteFig){
            res.status(400).json({error: "Could not remove figure"})
        }
        
        res.redirect("/admin")

    } catch (error) {
        let collectionList = await collectionData.getAllCollections();
        res.render("admin", {
            error: error.toString(),
            collection: collectionList,
            partial: "admin_script"
        });
    }
});
export default router;