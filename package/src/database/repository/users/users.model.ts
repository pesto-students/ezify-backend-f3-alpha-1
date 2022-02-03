import mongoose, { Model, Schema } from "mongoose";
import { UsersInterface } from "../../../interfaces/users/users.interface";

import jwt from "jsonwebtoken"; // should be remove and move to common package
import { sendMail } from "../../../helper/sendgrid"; // move to common package
import { generateOtp } from "../../../helper/genrate_otp";
import config from "../../../config/config";

const { ENCRYPTION_KEY } = config;

interface UserDocument extends UsersInterface, Document {
  toJSON(): void;
  generateAuthToken(): Promise<string>;
}

interface UserModel extends Model<UserDocument> {
  findByCredentials(email: string, role: string, SENDGRID_API_KEY: any, SENDGRID_SENDER_EMAIL: any): Promise<UserDocument>;
  userOtpVerify(id: string, otp: string): Promise<UserDocument>;
}

const Service = new mongoose.Schema({
  serviceID: { type: Schema.Types.ObjectId, ref: "Services" },
  basePrice: { type: Number, default: 0 },
});

const UserSchema: Schema<UserDocument> = new mongoose.Schema(
  {
    firstName: { type: String, default: " " },
    lastName: { type: String, default: " " },
    mobileNumber: { type: Number, default: 0 },
    address: { type: String, default: " " },
    profileImage: { type: String, default: "https://ezzifypesto.s3.ap-south-1.amazonaws.com/user.png" },
    adharCardImage: { type: String, default: null },
    panCardImage: { type: String, default: null },
    email: { type: String, default: "", unique: true },
    otpVerify: { type: String, trim: true, default: " " },
    bookingId: { type: Schema.Types.ObjectId, ref: "Bookings" },
    isEmailVerified: { type: Boolean, default: false },
    city: { type: String, default: " " },
    state: { type: String, default: " " },
    roles: { type: String, enum: ["admin", "user", "vendor"], default: "user" },
    amount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: false },
    isApproved: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    services: [Service],
    availabaleDate: { type: String, default: null },
    availableTime: { type: String, default: null },
    tokens: [
      {
        token: {
          type: String,
        },
        device_token: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.tokens;

  return userObject;
};

/**
 * To generate auth tokens for users
 */
UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, ENCRYPTION_KEY);

  // @ts-ignore
  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

/**
 * [x] Create new user if not existing and send otp to user's email
 * [x] Send otp to existing user's email
 *
 * @param email email of the user
 * @returns user object with otpVerify property
 */
UserSchema.statics.findByCredentials = async (email: string, role: string, SENDGRID_API_KEY: any, SENDGRID_SENDER_EMAIL: any) => {
  const user = await User.findOne({ email });
  const otp = generateOtp();

  if (!user) {
    const newUser = new User({ email, otpVerify: otp, roles: role });
    await sendMail(otp, email, SENDGRID_API_KEY, SENDGRID_SENDER_EMAIL);
    await newUser.save();
    return newUser;
  }

  user.otpVerify = otp;
  await sendMail(otp, email, SENDGRID_API_KEY, SENDGRID_SENDER_EMAIL);
  await user.save();
  return user;
};

/**
 * [x] find user with given otp to verify otp
 *
 * @param id object id of user object
 * @param otp otp sent to that user
 * @returns user object with otpVerify as empty string
 */
UserSchema.statics.userOtpVerify = async (id: string, otp: string) => {
  const user = await User.findOne({ _id: id, otpVerify: otp });
  if (!user) throw new Error("Invalid OTP");

  user.otpVerify = "";
  await user.save();
  return user;
};

const User = mongoose.model<UserDocument, UserModel>("User", UserSchema);

export default User;
