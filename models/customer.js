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
    RegistrationDate :{
        type: Date,
        default: Date.now 
    }
});

export const customerModel = model("customer", customerSchema);