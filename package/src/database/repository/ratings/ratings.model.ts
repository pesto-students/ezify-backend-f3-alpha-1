import mongoose, { Model, Schema } from "mongoose";
import config from "../../../config/config";

import {RatingInterface} from "../../../interfaces/ratings/ratings.interface";
const { ENCRYPTION_KEY } = config;

const RatingsSchema = new mongoose.Schema(
  {
    userID: { type: Schema.Types.ObjectId, ref: "User" , autopopulate: true},
    vendorID: { type: Schema.Types.ObjectId, ref: "User", autopopulate: true},
    ratings: {type: Number, default: 0},
    review: {type: String, default: " "}
  },
  {
    timestamps: true,
  }
);


RatingsSchema.plugin(require("mongoose-autopopulate"));

const Ratings = mongoose.model<RatingInterface>("Ratings", RatingsSchema);

export default Ratings;
