export async function connectToDB() {
    try {


        let connection = await connect(process.env.DB_URI||"mongodb://127.0.0.1:27017/myStor")
        console.log("mongo db connected" + connection.Connection)
    }
    catch (err) {
        console.log("cannot connect MongoDb" + err.message)
        process.exit(1)
    }
}