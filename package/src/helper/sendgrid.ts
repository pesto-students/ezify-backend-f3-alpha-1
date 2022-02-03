// this should be move to package common

import sgmail from "@sendgrid/mail";

export const sendMail = async (otp: string, email: string, SENDGRID_API_KEY: string, SENDGRID_SENDER_EMAIL: string) => {
  console.log("from package", SENDGRID_API_KEY, SENDGRID_SENDER_EMAIL);
  sgmail.setApiKey(SENDGRID_API_KEY);

  const message = {
    to: email,
    from: {
      name: "Ezzify",
      email: SENDGRID_SENDER_EMAIL,
    },
    subject: "Verify OTP",
    text: "This is your OTP please verify yourself",
    html: `<h1>This is your OTP - ${otp}</h1>`,
  };

  const sendmail = await sgmail.send(message);
  console.log(sendmail);
  if (sendmail) {
    return sendmail;
  } else return new Error("something went wrong!!");
};
