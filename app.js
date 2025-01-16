import cors from 'cors'
import express from "express"
import dotenv from "dotenv"

import {connectToDB} from "./config/DB.js"
import customerRouter from "./routers/customer.js"
import productRouter from "./routers/product.js"
import orderRouter from "./routers/order.js"

const app = express();
connectToDB();
dotenv.config();

app.use(cors())
app.use(express.json());

app.use("/api/products", productRouter)
app.use("/api/customers", customerRouter)
app.use("/api/orders", orderRouter)

const port = process.env.PORT;
app.listen(port, "localhost", ()=>{
    console.log("app is running in port " + port)
})

