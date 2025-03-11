import { Router } from "express";

import {checkManager,checkMiddleware} from "../middlewares/check"

import {  updatePassword, getAllCustomers, getById, update ,login,signUp} from "../controllers/customer.js"

const router = Router();

router.get("/", checkManager ,getAllCustomers);
router.get("/:id", getById);
router.put("/:id",checkMiddleware, update);
router.put("/:id/password",checkMiddleware,updatePassword)
router.post('/login', login);
router.post("/", signUp);



export default router;