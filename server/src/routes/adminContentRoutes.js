import express from "express";

import {
  listContent,
  createContent,
  updateContent,
  deleteContent
} from "../controllers/adminContentController.js";

import {
  protect
} from "../middleware/authMiddleware.js";

import {
  adminOnly
} from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(
  protect,
  adminOnly
);

router.get(
  "/:type",
  listContent
);

router.post(
  "/:type",
  createContent
);

router.patch(
  "/:type/:id",
  updateContent
);

router.delete(
  "/:type/:id",
  deleteContent
);

export default router;