import mongoose from "mongoose";

import { productModel } from "../models/product.js";


export async function getAllProducts(req, res) {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 8; 
        const skip = (page - 1) * limit; // חישוב מקום התחלתי של המוצרים

        const products = await productModel.find().skip(skip).limit(limit);
        const totalProducts = await productModel.countDocuments(); // סך כל המוצרים
        const totalPages = Math.ceil(totalProducts / limit); // חישוב מספר הדפים

        res.json({
            products,
            totalPages
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ title: "cannot get all products", message: err.message });
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
// export async function update(req, res) {
//     let { body } = req;
//     let { productName } = req.params;

//     if (body.productName?.length <= 2)
//         return res.status(400).json({ title: "cannot update product", message: "name is too short" });
//     if (body.price < 0)
//         return res.status(400).json({ title: "cannot update product", message: "price must be more than 0" });
//     if (body.ProductionDate && new Date(body.ProductionDate) > new Date())
//         return res.status(400).json({ title: "cannot update product", message: "productionDate must not be after today" });
//     if (body.color && body.color.length < 3)
//         return res.status(400).json({ title: "cannot update product", message: "color must be more than 3 characters" });
//     if (body.size && body.size.length < 3)
//         return res.status(400).json({ title: "cannot update product", message: "size must be more than 3 characters" });

//     try {
//         let product = await productModel.findOne({ productName: productName });

//         if (!product)
//             return res.status(404).json({ title: "product not found", message: "No product found with this name" });

//         let updatedProduct = await productModel.findByIdAndUpdate(product._id, body, { new: true });

//         if (!updatedProduct)
//             return res.status(404).json({ title: "cannot update product", message: "No product found to update" });

//         res.json(updatedProduct);
//     } catch (err) {
//         res.status(400).json({ title: "cannot update product", message: err.message });
//     }
// }

export async function update(req, res) {
    let { body } = req;
    let { id } = req.params;

    // הדפסת ה-ID שנשלח לבדיקת ערך תקין
    console.log('Received product ID:', id);

    // בדיקות שדות
    if (body.productName?.length <= 2)
        return res.status(400).json({ title: "cannot update product", message: "name is too short" });
    if (body.price < 0)
        return res.status(400).json({ title: "cannot update product", message: "price must be more than 0" });
    if (body.ProductionDate && new Date(body.ProductionDate) > new Date())
        return res.status(400).json({ title: "cannot update product", message: "productionDate must not be after today" });
    if (body.color && body.color.length < 3)
        return res.status(400).json({ title: "cannot update product", message: "color must be more than 3 characters" });
    if (body.size && body.size.length < 3)
        return res.status(400).json({ title: "cannot update product", message: "size must be more than 3 characters" });

    try {
        // חיפוש מוצר לפי ID
        let product = await productModel.findById(id);

        if (!product)
            return res.status(404).json({ title: "product not found", message: "No product found with this ID" });

        // עדכון המוצר לפי ID
        let updatedProduct = await productModel.findByIdAndUpdate(id, body, { new: true });

        if (!updatedProduct)
            return res.status(404).json({ title: "cannot update product", message: "No product found to update" });

        // החזרת המוצר המעודכן
        res.json(updatedProduct);
    } catch (err) {
        // טיפול בשגיאות
        res.status(400).json({ title: "cannot update product", message: err.message });
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8; 
        const skip = (page - 1) * limit; 
    
        console.log("category: " + category);
        try {
            const products = await productModel.find({ categories: { $in: [category] } })
                .skip(skip)
                .limit(limit);
    
            const totalProducts = await productModel.countDocuments({ categories: { $in: [category] } }); // סך כל המוצרים בקטגוריה
            const totalPages = Math.ceil(totalProducts / limit); // חישוב מספר הדפים
    
            res.json({
                products,
                totalPages
            });
        } catch (err) {
            res.status(400).json({ title: "cannot get by category", message: err.message });
        }
    }
    

