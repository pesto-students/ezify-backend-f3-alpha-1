import mongoose, { Model, Schema } from "mongoose";
import config from "../../../config/config";

import {NotificationInterface} from "../../../interfaces/notifiaction/notification.interface";

const { ENCRYPTION_KEY } = config;


const NotificationSchema = new mongoose.Schema(
  {

    to : {type: Schema.Types.ObjectId, ref: "User", autopopulate: true},
    from : {type: Schema.Types.ObjectId, ref: "User", autopopulate: true},
    data: [],
    read: {type: Boolean, default: false},
    type: {type:String, default: " "}

  },
  {
    timestamps: true,
  }
);


NotificationSchema.plugin(require("mongoose-autopopulate"));

const Notification = mongoose.model<NotificationInterface>("Notification", NotificationSchema);

export default Notification;
