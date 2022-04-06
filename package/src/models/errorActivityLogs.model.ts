import mongoose from "mongoose";

const ErrorActivityLogsSchema = new mongoose.Schema({
  activityDateTime: {
    type: String,
    required: true,
  },
  deviceDetails: {
    type: String,
    required: true,
  },
  errorMethod: {
    type: String,
    required: true,
  },
  endPoint: {
    type: String,
    required: true,
  },
  errorCode: {
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
  errorDetails: {
    type: String,
    required: true,
  },
  transactionsDetails: {
    type: String,
    required: true,
  },
});

const ErrorActivityLogsModel = mongoose.model<mongoose.Document>("error_activity_logs", ErrorActivityLogsSchema);

export default ErrorActivityLogsModel;
