import mongoose from "mongoose"

export async function connectToDB() {
    try {
        let connection = await mongoose.connect(process.env.DB_URI||"mongodb+srv://brachy222:B327640249b@cluster0.wu9xf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        console.log("mongo db connected" + connection.Connection)
    }
    catch (err) {
        console.log("cannot connect MongoDB " + err.message)
        process.exit(1)
    }
}