import mongoose from "mongoose";

import { customerModel } from "../models/customer.js";


export async function getAllCustomers(req, res) {
    try {

        let data = await customerModel.find();
        res.json(data)
    }
    catch (err) {
        res.status(400).json({ title: "acnoot get all customer", message: err.message })
    }
}

export async function getById(req, res) {
    let { id } = req;
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ "title": "invalid id", message: " id is not in correct format " })
    try {

        let data = await customerModel.findById(id);
        if (!data)
            return res.status(404).json({ "title": "cannot get by id", message: " no customer with such id found " })
        res.json(data)
    }
    catch (err) {
        res.status(400).json({ title: "acnoot get by id", message: err.message })
    }
}
export async function deleteById(req, res) {
    let { id } = req;
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ "title": "invalid id", message: " id is not in correct format " })
    try {

        let data = await customerModel.findByIdAndDelete(id);
        if (!data)
            return res.status(404).json({ "title": "cannot delete by id", message: " no customer with such id found " })
        res.json(data)
    }
    catch (err) {
        res.status(400).json({ title: "acnoot delete customer", message: err.message })
    }
}
export async function update(req, res) {
    let { id, body } = req;
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ "title": "invalid id", message: " id is not in correct format " })
    if (body.name?.length <= 2)
        return res.status(400).json({ title: "acnoot update customer", message: "name is too short" })
    try {

        let data = await customerModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!data)
            return res.status(404).json({ "title": "cannot update by id", message: " no customer with such id found " })
        res.json(data)
    }
    catch (err) {
        res.status(400).json({ title: "acnoot update customer", message: err.message })
    }
}
export async function add(req, res) {
    let { body } = req;
    if (!body.name || !body.phone)
        return res.status(400).json({ title: "missing required fields", message: "name and adress are required" })
    if (body.name.length <= 2)
        return res.status(400).json({ title: "acnoot update customer", message: "name is too short" })
    try {

        let newCustomer = new customerModel(body);
        let data = await newCustomer.save();

        res.json(data)
    }
    catch (err) {
        res.status(400).json({ title: "acnoot add customer", message: err.message })
    }


}