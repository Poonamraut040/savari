import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

// const connectDB = async () => {
//     try {
//         const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
//     } catch (error) {
//         console.log("MONGODB connection FAILED ", error);
//         process.exit(1)
//     }
// }



const connectDB = async () => {
    try {
        const ans = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log("MongoDb connected")
    }
    catch(error){
        console.log("mongodb connection failed", error);
        process.exit(1)
    }
}
export default connectDB