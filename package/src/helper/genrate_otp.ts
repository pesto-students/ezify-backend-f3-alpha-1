// move to common package ,,   its genrating random 4 digits
export const generateOtp = () => {
  let seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
  if (seq.toString().length !== 4) {
    generateOtp();
  }
  return seq;
};
