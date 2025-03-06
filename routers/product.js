import { Router } from "express";


import { add, getAllProducts, getById, update, deleteById, getCategory } from "../controllers/product.js"

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getById);
router.delete("/:id", deleteById);
router.put("/:productName", update);
router.post("/", add);
router.get("/category/:category", getCategory);

export default router;