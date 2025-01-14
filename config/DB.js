import mongoose from "mongoose"

export async function connectToDB() {
    try {
        let connection = await mongoose.connect(process.env.DB_URI||"mongodb://127.0.0.1:27017/myStore")
        console.log("mongo db connected" + connection.Connection)
    }
    catch (err) {
        console.log("cannot connect MongoDB " + err.message)
        process.exit(1)
    }
}