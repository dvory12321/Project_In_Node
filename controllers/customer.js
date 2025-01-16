import mongoose from "mongoose";

import { customerModel } from "../models/customer.js";


export async function getAllCustomers(req, res) {
    try {

        let data = await customerModel.find();
        res.json(data)
    }
    catch (err) {
        res.status(400).json({ title: "cannot get all customer", message: err.message })
    }
}

export async function getById(req, res) {
    let { _id } = req.params;
    if (!mongoose.isValidObjectId(_id))
        return res.status(400).json({ "title": "invalid id", message: " id is not in correct format " })
    try {

        let data = await customerModel.findById(_id);
        if (!data)
            return res.status(404).json({ "title": "cannot get by id", message: " no customer with such id found " })
        res.json(data)
    }
    catch (err) {
        res.status(400).json({ title: "cannot get by id", message: err.message })
    }
}

export async function update(req, res) {
    let {_id} = req.params
    let { body } = req;
    if (!mongoose.isValidObjectId(_id))
        return res.status(400).json({ "title": "invalid id", message: " id is not in correct format " })
    const { password, ...updateData } = body;
    if (body.uzerName?.length <= 2)
        return res.status(400).json({ title: "cannot update customer", message: "name is too short" })
    if (body.RegistrationDate && new Date(body.RegistrationDate) > new Date()) 
        return res.status(400).json({ title: "cannot update product", message: "productionDate must not be after today" });
    try {

        let data = await customerModel.findByIdAndUpdate(_id, req.body, { new: true });
        if (!data)
            return res.status(404).json({ "title": "cannot update by id", message: " no customer with such id found " })
        res.json(data)
    }
    catch (err) {
        res.status(400).json({ title: "cannot update customer", message: err.message })
    }
}
export async function add(req, res) {
    let { body } = req;
    if (!body.uzerName || !body.email)
        return res.status(400).json({ title: "missing required fields", message: "name and phone are required" })
    if (body.uzerName?.length <= 2)
        return res.status(400).json({ title: "cannot update customer", message: "name is too short" })
    try {

        let newCustomer = new customerModel(body);
        let data = await newCustomer.save();

        res.json(data)
    }
    catch (err) {
        res.status(400).json({ title: "cannot add customer", message: err.message })
    }
}

export async function updatePassword(req, res) {
    let { _id } = req.params;
    let { body } = req;
    
    if (!mongoose.isValidObjectId(_id))
        return res.status(400).json({ "title": "invalid id", message: "id is not in correct format" });

    if (!body.password || body.password.length < 6) {
        return res.status(400).json({ title: "invalid password", message: "Password is required and must be at least 6 characters long" });
    }

    try {
        let data = await customerModel.findByIdAndUpdate(_id, { password: body.password }, { new: true });

        if (!data)
            return res.status(404).json({ "title": "cannot update by id", message: "no customer with such id found" });

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(400).json({ title: "cannot update password", message: err.message });
    }
}

export async function login(req, res) {
    const { uzerName, password } = req.body; 
    if (!uzerName || !password) {
        return res.status(400).json({ title: "missing fields", message: "Username and password are required" });
    }

    try {
        const user = await customerModel.findOne({ uzerName });

        if (!user) {
            return res.status(404).json({ title: "user not found", message: "No user with such username found" });
        }

        if (user.password === password) {
            res.json({ message: "Login successful", user: { uzerName: user.uzerName, email: user.email, role: user.role } });
        } else {
            res.status(401).json({ title: "invalid password", message: "The password is incorrect" });
        }

    } catch (err) {
        res.status(500).json({ title: "server error", message: err.message });
    }
}

