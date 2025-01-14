import express from "express"
import dotenv from "dotenv"

import {connectToDB} from "./config/DB.js"
import customerRouter from "./routers/customer.js"
import productRouter from "./routers/product.js"
// import buyingRouter from "./routers/buying.js"

const app = express();
connectToDB();
dotenv.config();

app.use(express.json());

app.use("/api/products", productRouter)
app.use("/api/customers", customerRouter)
// app.use("/buyings", buyingRouter)

const port = process.env.PORT;
app.listen(port, "localhost", ()=>{
    console.log("app is running in port " + port)
})

