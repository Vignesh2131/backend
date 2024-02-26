import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import express from "express"

const connectDB = async () => {
    try {
        const connectionInstantce = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected ! DB Host : ${connectionInstantce.connection.host}`)
    } catch (error) {
        console.log("MongoDb connection error", error);
        process.exit(1)
    }
}

export default connectDB