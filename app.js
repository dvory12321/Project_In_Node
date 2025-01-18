import express from "express"
import dotenv from "dotenv"

import {connectToDB} from "./config/DB.js"
import customerRouter from "./routers/customer.js"
import productRouter from "./routers/product.js"
import orderRouter from "./routers/order.js"

const app = express();
connectToDB();
dotenv.config();

app.use(express.json());

app.use("/api/products", productRouter)
app.use("/api/customers", customerRouter)
app.use("/api/orders", orderRouter)

const port = process.env.PORT || 10000;
app.listen(port, "0.0.0.0", ()=>{
    console.log("app is running in port " + port)
})

