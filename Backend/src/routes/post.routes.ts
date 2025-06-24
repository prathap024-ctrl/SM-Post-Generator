import { Router } from "express";
import { generatePost } from "../controllers/post.controllers";

const router = Router();

router.route("/generate-post").post((req, res, next) => {
  generatePost(req, res).catch(next);
});

export default router;
