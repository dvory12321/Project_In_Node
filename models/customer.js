import { Schema, model } from "mongoose";

const customerSchema = new Schema({
    userName: String,
    email: String,
    password : String,
    phone : String,
    role: {
        type: String,
        default: 'user' 
    },
    RegistrationDate : Date
});

export const customerModel = model("customer", customerSchema);