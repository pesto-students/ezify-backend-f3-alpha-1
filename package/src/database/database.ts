import mongoose from "mongoose";
import config from "../config/config";


const { MONGO_CONNECTION_STRING, MONGO_PASSWORD } = config;
// @ts-ignore
const db = MONGO_CONNECTION_STRING?.replace("<PASSWORD>", MONGO_PASSWORD);

// Connecting to the database
const connectDB = () => {
  mongoose
    // @ts-ignore
    .connect(db)
    .then(() => {
      console.log("DB connection successful!");
    })
    .catch((err) => {
      console.log("Could not connect to the database. Exiting now...", err);
      process.exit();
    });
};

export default connectDB;
