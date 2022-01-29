import mongoose, { Model, Schema } from "mongoose";
import {PaymentInterface} from "../../../interfaces/paymentLogs/payment.interface";
import config from "../../../config/config";

const { ENCRYPTION_KEY } = config;


const PaymentlogsSchema = new mongoose.Schema(
    {
        serviceID: { type: Schema.Types.ObjectId, ref: "Services", autopopulate: true },
        vendorID: { type: Schema.Types.ObjectId, ref: "User", autopopulate: true },
        baseprice: {type: Number, default: 0},
        payment_flag: {type: Boolean, default: false},
        userID: { type: Schema.Types.ObjectId, ref: "User", autopopulate: true},
        status: { type: String, enum: ["active", "completed", "recieved"], default: "active" },

    },
  {
    timestamps: true,
  }
);

PaymentlogsSchema.plugin(require("mongoose-autopopulate"));

const Payment = mongoose.model<PaymentInterface>("Payment", PaymentlogsSchema);

export default Payment;
