import express from "express"
import dotenv from "dotenv"
import cors from 'cors'
import jwt from 'jsonwebtoken';


dotenv.config();
console.log("JWT_SECRET from env:", process.env.JWT_SECRET); // בדיקה אם המשתנה נטען נכון

import {connectToDB} from "./config/DB.js"
import customerRouter from "./routers/customer.js"
import productRouter from "./routers/product.js"
import orderRouter from "./routers/order.js"

const app = express();
connectToDB();
app.use(cors())
app.use(express.json());


app.use("/api/products", productRouter)
app.use("/api/customers", customerRouter)
app.use("/api/orders", orderRouter)

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IteR16jXm9eZIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyOTI1NDk1LCJleHAiOjE3NDI5MjkwOTV9.cRzJw2cc6W90ORMJgiGBC6U4wVEx4opwcI8Hk3W3Z34";
    const secretKey = process.env.JWT_SECRET;

    try {
        const decoded = jwt.verify(token, secretKey);
        console.log("token: " + decoded);
    } catch (err) {
        console.error("פענוח הטוקן נכשל:", err);
    }

const port = process.env.PORT || 10000;
app.listen(port, "0.0.0.0", ()=>{
    console.log("app is running in port " + port)
})


    // טוקן ודוגמת מפתח
    

