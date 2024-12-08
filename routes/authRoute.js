import { Router } from "express";

const router = Router();

router
  .route("/sign-in")
  .get(async (req, res) => {
    return res.render("signin");
  })
  .post(async (req, res) => {
    const body = req.body;
  });

router
  .route("/sign-up")
  .get(async (req, res) => {
    return res.render("signup");
  })
  .post(async (req, res) => {});

export default router;
