import mongoose, { Model, Schema } from "mongoose";
import { ServicesInterface } from "../../../interfaces/services/services.interface";
import config from "../../../config/config";

const { ENCRYPTION_KEY } = config;


const ServicesSchema = new mongoose.Schema(
    {
        name: { type: String, default: " ",  unique: true},
        description: { type: String, default: " "},
        image: { type: String, default: " "},
    },
  {
    timestamps: true,
  }
);

const Services = mongoose.model<ServicesInterface>("Services", ServicesSchema);

export default Services;
