import { Router } from "express";


import { add, getAllProducts, getById, update, deleteById } from "../controllers/product.js"

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getById);
router.delete("/:id", deleteById);
router.put("/:id", update);
router.post("/", add);

export default router;