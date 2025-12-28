import express from "express";
import {
  createProduct,
  getRandomProducts,
  getProductsByCategory,
  filterProducts,
  getSellerProducts,
  updateProduct,
  deleteProduct,
  redirectToSeller
} from "../controllers/product.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { isSeller } from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const   router = express.Router();

/* ================= BUYER (PUBLIC) ================= */

// Public browsing (no auth)
router.get("/random", getRandomProducts);
router.get("/", filterProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/:id/redirect", redirectToSeller);

/* ================= SELLER ================= */

router.post("/", requireAuth, isSeller, upload.array("images",5), createProduct);
router.get("/seller/me", requireAuth, isSeller, getSellerProducts);
router.put("/:id", requireAuth, isSeller, updateProduct);
router.delete("/:id", requireAuth, isSeller, deleteProduct);

export default router;
