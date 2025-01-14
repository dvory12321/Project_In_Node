import mongoose from "mongoose";

import { productModel } from "../models/product.js";


export async function getAllProducts(req, res) {
    try {

        let data = await productModel.find();
        res.json(data)
    }
    catch (err) {
        res.status(400).json({ title: "cannot get all products", message: err.message })
    }
}

export async function getById(req, res) {
    let { id } = req;
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ "title": "invalid id", message: " id is not in correct format " })
    try {

        let data = await productModel.findById(id);
        if (!data)
            return res.status(404).json({ "title": "cannot get by id", message: " no product with such id found " })
        res.json(data)
    }
    catch (err) {
        res.status(400).json({ title: "cannot get by id", message: err.message })
    }
}
export async function deleteById(req, res) {
    let { id } = req;
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ "title": "invalid id", message: " id is not in correct format " })
    try {

        let data = await productModel.findByIdAndDelete(id);
        if (!data)
            return res.status(404).json({ "title": "cannot delete by id", message: " no product with such id found " })
        res.json(data)
    }
    catch (err) {
        res.status(400).json({ title: "cannot delete product", message: err.message })
    }
}
export async function update(req, res) {
    let { id, body } = req;
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ "title": "invalid id", message: " id is not in correct format " })
    if (body.productName?.length <= 2)
        return res.status(400).json({ title: "cannot update product", message: "name is too short" })
    if (body.price < 0)
        return res.status(400).json({ title: "cannot update product", message: "price must be more than 0" })
    if (new Date(body.ProductionDate) > new Date()) 
        return res.status(400).json({ title: "cannot update product", message: "productionDate must not be after today" });
    try {
        let data = await productModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!data)
            return res.status(404).json({ "title": "cannot update by id", message: " no product with such id found " })
        res.json(data)
    }
    catch (err) {
        res.status(400).json({ title: "cannot update product", message: err.message })
    }
}
export async function add(req, res) {
    let { body } = req;
    if(!body.productName || !body.price)
        return res.status(400).json({title: "cannot add product", message: "productName and price are required"})
    if (body.name.length <= 2)
        return res.status(400).json({ title: "cannot add product", message: "name is too short" })
    try {

        let newProduct = new productModel(body);
        let data = await newProduct.save();

        res.json(data)
    }
    catch (err) {
        res.status(400).json({ title: "cannot add product", message: err.message })
    }


}