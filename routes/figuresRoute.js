import { Router } from "express";

const router = Router();
import { getAllFigures } from "../data/figures.js";

// get all figures
router.get("/:id", async (req, res) => {
  const { id: collectionId } = req.params;

  try {
    const figureList = await getAllFigures(collectionId);

    return res.json(figureList);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

export default router;
