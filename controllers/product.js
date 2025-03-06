import mongoose from "mongoose";

import { productModel } from "../models/product.js";


export async function getAllProducts(req, res) {
    try {

        let data = await productModel.find();
        res.json(data)
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ title: "cannot get all products", message: err.message })
    }
}

export async function getById(req, res) {
    let { id } = req.params;
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
    let { id } = req.params;
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
import mongoose from "mongoose";
import productModel from "../models/productModel.js";

export async function update(req, res) {
    let { body } = req;
    let { productName } = req.params;

    // בדיקה אם שם המוצר קיים
    if (!productName || productName.length < 2) {
        return res.status(400).json({ title: "invalid productName", message: "Product name is required and must be at least 2 characters" });
    }

    if (body.price !== undefined && body.price < 0) {
        return res.status(400).json({ title: "cannot update product", message: "Price must be greater than or equal to 0" });
    }

    if (body.ProductionDate) {
        let productionDate = new Date(body.ProductionDate);
        if (isNaN(productionDate.getTime())) {
            return res.status(400).json({ title: "cannot update product", message: "Invalid production date format" });
        }
        if (productionDate > new Date()) {
            return res.status(400).json({ title: "cannot update product", message: "Production date cannot be in the future" });
        }
    }

    if (body.color && body.color.length < 3) {
        return res.status(400).json({ title: "cannot update product", message: "Color must be at least 3 characters" });
    }

    if (body.size && body.size.length < 3) {
        return res.status(400).json({ title: "cannot update product", message: "Size must be at least 3 characters" });
    }

    try {
        let updatedProduct = await productModel.findOneAndUpdate(
            { productName: productName }, body, { new: true } 
        );

        if (!updatedProduct) {
            return res.status(404).json({ title: "cannot update product", message: "No product found with the given name" });
        }

        res.json(updatedProduct);
    } 
    catch (err) {
        res.status(500).json({ title: "cannot update product", message: err.message });
    }
}

export async function add(req, res) {
    let { body } = req;
    console.log(body);
    
    if(!body.productName || !body.price)
        return res.status(400).json({title: "cannot add product", message: "productName and price are required"})
    if (body.productName?.length <= 2)
        return res.status(400).json({ title: "cannot add product", message: "name is too short" })
    if (body.ProductionDate && new Date(body.ProductionDate) > new Date()) 
        return res.status(400).json({ title: "cannot update product", message: "productionDate must not be after today" });
    if(body.price < 0)
        return res.status(400).json({title: "cannot add product", message: "price must be more than 0"})
    if(body.color && body.color.length < 3)
        return res.status(400).json({title: "cannot add product", message: "color must be more than 3 characters"})
    if(body.size && body.size.length <2 )
        return res.status(400).json({title: "cannot add product", message: "size must be more than 3 characters"})
    try {

        let newProduct = new productModel(body);
        let data = await newProduct.save();
        res.json(data)
    }
    catch (err) {
        res.status(400).json({ title: "cannot add product", message: err.message })
    }}

export async function getCategory(req, res) {
    let { category } = req.params;
    console.log("category: " + category);
    try {
        let data = await productModel.find
            ({ categories: { $in: [category] } });
        res.json(data)
    }
    catch (err) {
        res.status(400).json({ title: "cannot get by category", message: err.message })
    }
}

