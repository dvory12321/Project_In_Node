import { Schema, model } from "mongoose";

const productSchema = new Schema({
    productName: String,
    description: String,
    ProductionDate: Date,
    color: String,
    size: String,
    image: String,
    price: Number,
    categories: [String]

});

export const productModel = model("product", productSchema);