import mongoose, { Model, Schema } from "mongoose";
import config from "../../../config/config";

import { BookingInterface } from "../../../interfaces/bookings/booking.interface";

const { ENCRYPTION_KEY } = config;

const booking = new mongoose.Schema({
  serviceID: { type: Schema.Types.ObjectId, ref: "Services", autopopulate: true },
  vendorID: { type: Schema.Types.ObjectId, ref: "User", autopopulate: true },
  baseprice: { type: Number, default: 0},
  status: { type: String, enum: ["active", "completed", "recieved"], default: "active" },

});

const BookingsSchema = new mongoose.Schema(
  {
    userID: { type: Schema.Types.ObjectId, ref: "User" },
    total_amount: { type: Number, default: 0 },
    bookings: [booking],
    payment : {type: Boolean, default: true},
    payment_id: { type: String, default: ""}
  },
  {
    timestamps: true,
  }
);


BookingsSchema.plugin(require("mongoose-autopopulate"));

const Bookings = mongoose.model<BookingInterface>("Bookings", BookingsSchema);

export default Bookings;
