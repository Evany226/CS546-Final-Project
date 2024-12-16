import { Router } from "express";

const router = Router();

router.route("/").get(async (req, res) => {
  res.render("trade-requests", { title: "Trade Requests" });
});

export default router;
