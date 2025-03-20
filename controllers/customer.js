import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import generateToken from "../generateToken.js";
import { customerModel } from "../models/customer.js";
import jwt from "jsonwebtoken";


export async function getAllCustomers(req, res) {
    try {
        let data = await customerModel.find().select('-password'); 
        res.json(data);
    } catch (err) {
        res.status(400).json({ title: "cannot get all customers", message: err.message });
    }
}


export async function getById(req, res) {
    let { id } = req.params;

    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ title: "invalid id", message: "id is not in correct format" });

    try {
        let data = await customerModel.findById(id).select('-password'); 

        if (!data)
            return res.status(404).json({ title: "cannot get by id", message: "no customer with such id found" });

        res.json(data);
    } catch (err) {
        res.status(400).json({ title: "cannot get by id", message: err.message });
    }
}


// export async function update(req, res) {
//     let {id} = req.params
//     let { body } = req;
//     if (!mongoose.isValidObjectId(id))
//         return res.status(400).json({ "title": "invalid id", message: " id is not in correct format " })
//     const { password, ...updateData } = body;
//     if (body.userName?.length <= 2)
//         return res.status(400).json({ title: "cannot update customer", message: "name is too short" })
//     if (body.RegistrationDate && new Date(body.RegistrationDate) > new Date()) 
//         return res.status(400).json({ title: "cannot update customer", message: "RegistrationDate must not be after today" });

//     try {

//         let data = await customerModel.findByIdAndUpdate(id, req.body, { new: true });
//         if (!data)
//             return res.status(404).json({ "title": "cannot update by id", message: " no customer with such id found " })
//         res.json(data)
//     }
//     catch (err) {
//         res.status(400).json({ title: "cannot update customer", message: err.message })
//     }
// }
export async function update(req, res) {
    let { id } = req.params;
    let { body } = req;

    // בדיקה האם ה-ID תקין
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ "title": "invalid id", message: "id is not in correct format" });

    // הוצאת שדה הסיסמה כדי לא לעדכן אותו
    const { password, ...updateData } = body;

    // בדיקה אם שם המשתמש קצר מדי
    if (body.userName?.length <= 2)
        return res.status(400).json({ title: "cannot update customer", message: "name is too short" });

    // בדיקה אם תאריך ההרשמה גדול מהיום הנוכחי
    if (body.RegistrationDate && new Date(body.RegistrationDate) > new Date()) 
        return res.status(400).json({ title: "cannot update customer", message: "RegistrationDate must not be after today" });

    try {
        // ביצוע העדכון עם הנתונים המסוננים
        let data = await customerModel.findByIdAndUpdate(id, updateData, { new: true }).select(-password);

        // אם לא נמצא לקוח עם ה-ID הנתון
        if (!data)
            return res.status(404).json({ "title": "cannot update by id", message: "no customer with such id found" });

        res.json(data);
    }
    catch (err) {
        res.status(400).json({ title: "cannot update customer", message: err.message });
    }
}

export async function add(req, res) {
    let { body } = req;

    if (!body.userName || !body.email)
        return res.status(400).json({ title: "missing required fields", message: "name and email are required" });

    if (body.userName?.length <= 2)
        return res.status(400).json({ title: "cannot add customer", message: "name is too short" });

    // בדיקה אם המייל תקני
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
        return res.status(400).json({ title: "invalid email", message: "Email is not in a valid format" });
    }

    // הוספת תאריך ההוספה
    const today = new Date();

    try {
        // יצירת לקוח חדש עם המידע כולל תאריך ההוספה
        let newCustomer = new customerModel({
            ...body,
            createdAt: today, // שמירת תאריך ההוספה
            updatedAt: today  // עדכון תאריך עדכון אם יש צורך
        });

        let data = await newCustomer.save();
        res.json(data);

    } catch (err) {
        res.status(400).json({ title: "cannot add customer", message: err.message });
    }
}

export async function updatePassword(req, res) {
    let { id } = req.params;
    let { body } = req;
    
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ "title": "invalid id", message: "**id is not in correct format" });

    if (!body.password || body.password.length < 6) {
        return res.status(400).json({ title: "invalid password", message: "Password is required and must be at least 6 characters long" });
    }

    try {
        let data = await customerModel.findByIdAndUpdate(id, { password: body.password }, { new: true });

        if (!data)
            return res.status(404).json({ "title": "cannot update by id", message: "no customer with such id found" });

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(400).json({ title: "cannot update password", message: err.message });
    }
}

export async function login(req, res) {
    const { userName, password } = req.body;
    console.log("login!!!")

    if (!userName || !password) {
        return res.status(400).json({ title: "missing fields", message: "Username and password are required" });
    }

    try {
        const user = await customerModel.findOne({ userName });
        console.log("user: " + user)

        if (!user) {
            return res.status(404).json({ title: "user not found", message: "No user with such username found" });
        }

        // השוואת סיסמאות
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ title: "invalid password", message: "Incorrect password" });
        }

        // יצירת טוקן
        const token = generateToken(user._id);
        console.log(token);

        res.json({
            _id: user._id,
            userName: user.userName,
            email: user.email,
            role: user.role,
            token, // שליחת הטוקן ללקוח
        });

    } catch (err) {
        res.status(500).json({ title: "server error", message: err.message });
    }
}


export async function signUp(req, res) {
    let { body } = req;

    if (!body.password || !body.userName || !body.email || !body.phone)
        return res.status(400).json({ title: "missing fields", message: "userName, password, phone, and email are required" });

    try {
        // בדיקה אם המשתמש כבר קיים
        const existingUser = await customerModel.findOne({ userName: body.userName });
        if (existingUser) {
            return res.status(400).json({ title: "user exists", message: "User already exists" });
        }

        // הצפנת הסיסמה
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.password, salt);

        // יצירת משתמש חדש
        let newCustomer = new customerModel({ ...body, password: hashedPassword });
        await newCustomer.save();

        // יצירת טוקן
         const token = generateToken(newCustomer._id);
        console.log(token);

        return res.json({
            _id: newCustomer._id,
            userName: newCustomer.userName,
            email: newCustomer.email,
            phone: newCustomer.phone,
             token, // שליחת הטוקן ללקוח
        });

    } catch (err) {
        res.status(400).json({ title: "cannot create user", message: err.message });
    }
}

