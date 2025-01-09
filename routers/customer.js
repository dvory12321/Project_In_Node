import { Router } from "express";


import { add, deleteById, getAllCustomers, getById, update } from "../controllers/customer.js"

const router = Router();

router.get("/", getAllCustomers);
router.get("/:id", getById);
router.delete("/:id", deleteById);
router.put("/:id", update);
router.post("/", add);

export default router;