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

// פונקציה שמקבלת הזמנה ומעדכנת לה את שדה totalPrice לפי price וamount
function updateOrderWithTotalPrice(order) {
    order.products.forEach(product => {
        product.totalPrice = product.price * product.amount;
    });
    return order;
}

// פונקציה שמחזירה את הסכום לתשלום עבור כל ההזמנות
function calculateTotalOrderPrice(order) {
    if (!Array.isArray(order.products)) {
        throw new Error("products should be an array");
    }
    
    return order.products.reduce((total, product) => {
        const price = Number(product.totalPrice);
        return total + (isNaN(price) ? 0 : price);
    }, 0);
}



export async function addOrder(req, res) {
    let { body } = req;
    if (!body.destDate || !body.address || !body.cust_id || !body.products)
        return res.status(400).json({ title: "missing required fields", message: "destDate, address, cust_id and products are required" })
    if (body.address?.length <= 2)
        return res.status(400).json({ title: "cannot add order", message: "address is too short" })
    if(body.products?.length < 1)
        return res.status(400).json({title: "there are no products", message: "filed products is empty"})
    try {
        //מעדכנים בהזמנה לכל מוצר במערל המוצרים את השדה totalPrice  
        
        body = updateOrderWithTotalPrice(body);
        // totalPrice מכיל את סכום כל המוצרים 
        let totalPrice = calculateTotalOrderPrice(body);
        let newOrder = new orderModel({
            ...body,
            date: new Date(),
            finallyPrice: (body.priceToShipment || 100) + totalPrice
        });
        console.log("newOrder: "+ newOrder);
        
        let data = await newOrder.save();

        res.json(data)
    }
    catch (err) {
        res.status(400).json({ title: "cannot add order", message: err.message })
    }
}