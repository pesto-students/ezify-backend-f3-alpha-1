// this should be move to package common

import sgmail from "@sendgrid/mail";
import { config } from "../config";

export const sendMail = async (otp: string, email: string) => {
  sgmail.setApiKey(config.SENDGRID_API_KEY); 

  const message = {
    to: email,
    from: {
      name: "Ezzify",
      email: config.SENDGRID_SENDER_EMAIL, 
    },
    subject: "Verify OTP",
    text: "This is your OTP please verify yourself",
    html: `<h1>This is your OTP - ${otp}</h1>`,
  };

  const sendmail = await sgmail.send(message);
  if (sendmail) {
    return sendmail;
  } else return new Error("something went wrong!!");
};
