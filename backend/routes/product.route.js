import express from "express";
import {
  createProduct,
  getRandomProducts,
  getProductsByCategory,
  filterProducts,
  getSellerProducts,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { isBuyer, isSeller } from "../middlewares/role.middleware.js";

const router = express.Router();

/* Buyer (PUBLIC) ROUTES */
router.get("/random", requireAuth, isBuyer, getRandomProducts);
router.get("/", requireAuth, isBuyer, filterProducts);
router.get("/category/:category", requireAuth, isBuyer, getProductsByCategory);

/* Seller ROUTES */
router.post("/", requireAuth, isSeller, createProduct);
router.get("/seller/me", requireAuth, isSeller, getSellerProducts);
router.put("/:id", requireAuth, isSeller, updateProduct);
router.delete("/:id", requireAuth, isSeller, deleteProduct);
export default router;