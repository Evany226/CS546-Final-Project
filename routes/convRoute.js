import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  return res.render("conversation");
});

export default router;
