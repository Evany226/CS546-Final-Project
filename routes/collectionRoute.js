import { Router } from 'express';
const router = Router();
import { collectionData, figureData } from '../data/index.js';
import { checkString,checkId } from '../helpers.js';
import { Collection } from 'mongodb';


router
    .route('/collections')
    .get(async (req, res) =>{
        try{
            let collectionList = await collectionData.getAllCollections();
            res.render("collections", {
                title: "Collection",
                collection: collectionList
            });
        }catch(e){ 
            console.log(e)
            res.status(400).render("collections")
        }
    });
    

export default router;