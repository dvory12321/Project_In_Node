import mongoose from "mongoose";

import { orderModel } from "../models/order.js";


export async function getAllOrders(req, res) {
    try {
        let data = await orderModel.find();
        res.json(data)
    }
    catch (err) {
        res.status(400).json({ title: "cannot get all orders", message: err.message })
    }
}

export async function getAllOrdersByCustId(req, res){
    let {id} = req.params;
    if(!mongoose.isValidObjectId(id))
        return res.status(400).json({title: "invalidId", massage: "id is not in correct format"})
    try{
        let data = await orderModel.find({ cust_id: id });
        if(data.length == 0)
            return res.status(404).json({title: "cannot find by customer id", massage: "no order of this customer"})
        res.json(data)
    }
    catch(err){
        res.status(400).json({title: "cannot find by customer id", massage: err})
    }
}

export async function deleteById(req, res) {
    let { id } = req.params;
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ title: "invalid id", message: " id is not in correct format " })
    try {
        let data = await orderModel.findById(id);
        if (!data)
            return res.status(404).json({ title: "cannot delete by id", message: " no order with such id found " })
        if(data.isInWay)
            return res.status(400).json({title: "order already in way", massage: "cannot dalete a placed order "})
        await orderModel.findByIdAndDelete(id)
        res.json(data)
    }
    catch (err) {
        res.status(400).json({ title: "cannot delete order", message: err.message })
    }
}
export async function perform(req, res) { // עדכון הזמנה להזמנה שבוצעה - בדרך
    let {id} = req.params
    let { body } = req;
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ title: "invalid id", message: " id is not in correct format " })
    try {
        let data = await orderModel.findByIdAndUpdate(id, {...body, isInWay: true}, { new: true });
        if (!data)
            return res.status(404).json({ title: "cannot update by id", message: " no order with such id found " })
        res.json(data)
    }
    catch (err) {
        res.status(400).json({ title: "cannot perform order", message: err.message })
    }
}

export async function addOrder(req, res) {
    let { body } = req;
    // body מכיל את הערכים של מודל הזמנה
    if (!body.destDate || !body.address || !body.cust_id || !body.products || !body.priceToShipment || !body.finallyPrice)
        return res.status(400).json({ 
    title: "missing required fields", message: "destDate, address, cust_id, product, priceToShipment, finallyPrice and products are required" });
    if (body.address?.length <= 2)
        return res.status(400).json({ title: "cannot add order", message: "address is too short" });
    if (body.products?.length < 1)
        return res.status(400).json({ title: "there are no products", message: "field products is empty" });

    try {
        // בדוק אם destDate הוא תאריך תקני
        const destDate = new Date(body.destDate);
        if (isNaN(destDate.getTime())) {
            return res.status(400).json({ title: "cannot add order", message: "destDate is not a valid date" });
        }
        let newOrder = new orderModel({
            ...body,
            destDate: destDate,
            cust_id: new mongoose.Types.ObjectId(body.cust_id), // השתמש ב-new
            date: new Date(),
            finallyPrice: (body.priceToShipment || 100) + body.finallyPrice
        });
        
        let data = await newOrder.save();

        res.json(data);
    }
    catch (err) {
        res.status(400).json({ title: "cannot add order", message: err.message });
    }
}
