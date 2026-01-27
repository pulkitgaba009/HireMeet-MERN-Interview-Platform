import mongoose from "mongoose";
import { ENV } from "../lib/env.js";

async function connectDB (){
    try {
        if(!ENV.MONGODB_URI){
            throw new Error("MONGODB_URI is not defined");
        }

        await mongoose.connect(ENV.MONGODB_URI);
        console.log("✅ MONGO DB CONNECTED SUCCESSFULLY !!!");
    } catch (error) {
        console.log("❌ NOT ABLE TO CONNECT TO DB !!!");
        process.exit(1);  // 0 success 1 means failiure 
    }
}

export default connectDB;