import mongoose from "mongoose";

const ActivityLogsSchema = new mongoose.Schema({
  activityDateTime: {
    type: String,
    required: true,
  },
  deviceDetails: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  endPoint: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
  statusCode: {
    type: Number,
    required: true,
  },
  responseTime: {
    type: String,
    required: true,
  },
  transactionsDetails: {
    type: String,
    required: true,
  },
});

const ActivityLogsModel = mongoose.model<mongoose.Document>("activity_logs", ActivityLogsSchema);

export default ActivityLogsModel;
