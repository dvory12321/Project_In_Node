import mongoose from "mongoose"

export async function connectToDB() {
    try {
        let connection = await mongoose.connect(process.env.DB_URI||"mongodb+srv://dvory:d327903993w@store.hcmrm.mongodb.net/?retryWrites=true&w=majority&appName=Store")
        console.log("mongo db connected" + connection.Connection)
    }
    catch (err) {
        console.log("cannot connect MongoDB " + err.message)
        process.exit(1)
    }
}