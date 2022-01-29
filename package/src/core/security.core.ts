import "dotenv/config";

import CryptoJS from "crypto-js";
import { config } from "./../config";

const { ENVIRONMENT, ENCRYPTION_KEY } = config;

enum StatusCode {
  INVALID_ENCRYPTED_INPUT = "10004",
}

class Security {
  public static encryption = (body: any) => {
    // @ts-ignore
    return CryptoJS.AES.encrypt(JSON.stringify(body), ENCRYPTION_KEY).toString();
  };

  public static decryption = (body: any) => {
    try {
      // @ts-ignore
      const bytes = CryptoJS.AES.decrypt(body, ENCRYPTION_KEY);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (err) {
      return StatusCode.INVALID_ENCRYPTED_INPUT;
    }
  };
}

export default Security;
