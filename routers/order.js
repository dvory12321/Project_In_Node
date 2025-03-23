import { Router } from "express";
import {checkManager,checkMiddleware} from "../middlewares/check.js"

import { getAllOrders, getAllOrdersByCustId, deleteById, addOrder, perform } from "../controllers/order.js"

const router = Router();

router.get("/", getAllOrders);
router.get("/:id", getAllOrdersByCustId);
router.delete("/:id", deleteById);
router.put("/:id", perform);
router.post("/", addOrder);

export default router;