import { Schema, model, Types } from "mongoose";

const minimalProductSchema = new Schema({
    _id: {type: Types.ObjectId, ref: 'product'},
    productName: String,
    description: String,
    image: String,
    price: Number,
    amount: Number,
    totalPrice: Number
})

const orderSchema = new Schema({
    date: Date,
    destDate: Date,
    address: String, 
    cust_id: {type: Types.ObjectId, ref: "customer"},
    products: [minimalProductSchema],
    /*products_id: [{type: Types.ObjectId, ref: "product"}],*/
    isInWay: {type: Boolean, default: false},
    priceToShipment: {type:Number, default: 100},
    finallyPrice: Number
});

export const orderModel = model("order", orderSchema);