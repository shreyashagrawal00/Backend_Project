import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

async function connectDB() {
  try {
    const ConnectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`MONGODB Connected!!: ${ConnectionInstance.connection.host}`);
    
  } catch (error) {
    console.log("MONGODB Connection Error",error);
    process.exit(1);   
  }
}

export default connectDB;
