import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});

connectDB();




//"dev": "nodemon -r dotenv/config --experimental-modules src/index.js"