import { Router } from "express";


import {  updatePassword, getAllCustomers, getById, update ,login,signUp} from "../controllers/customer.js"

const router = Router();

router.get("/", getAllCustomers);
router.get("/:id", getById);
router.put("/:id", update);
router.put("/:id/password",updatePassword)
router.post('/login', login);
router.post("/", signUp);



export default router;