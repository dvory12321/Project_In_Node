import { Schema, model } from "mongoose";

const customerSchema = new Schema({
    _id: String,
    email: String,
    uzerName: String,
    password : String,
    role: {
        type: String,
        default: 'uzer' 
    },
    RegistrationDate : Date
});

export const customerModel = model("customer", customerSchema);