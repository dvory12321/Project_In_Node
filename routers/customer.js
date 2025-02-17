import { Router } from "express";


import { add, updatePassword, getAllCustomers, getById, update ,login} from "../controllers/customer.js"

const router = Router();

router.get("/", getAllCustomers);
router.get("/:id", getById);
router.put("/:id", update);
router.post("/", add);
router.put("/:id",updatePassword)
router.post('/login', login);


export default router;