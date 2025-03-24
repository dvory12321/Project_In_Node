import { Router } from "express";
import {checkManager,checkMiddleware} from "../middlewares/check.js"

import { add, getAllProducts, getById, update, deleteById, getCategory } from "../controllers/product.js"

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getById);
router.delete("/:id",checkManager, deleteById);
router.put("/:productName",checkManager, update);
// router.post("/",checkManager, add);
router.post("/", add);

router.get("/category/:category", getCategory);

export default router;