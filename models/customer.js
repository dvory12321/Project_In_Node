import { Schema, model } from "mongoose";

const customerSchema = new Schema({
    firstName: String,
    lastName: String,
    phone: String,
});

export const customerModel = model("customer", customerSchema);