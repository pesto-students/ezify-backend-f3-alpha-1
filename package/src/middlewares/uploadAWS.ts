import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import {config} from "../config"

// common package
AWS.config.update({
  accessKeyId: config.ACCESS_KEY_S3, //ENV
  secretAccessKey: config.SECRET_KEY_S3,
  region: config.AWS_REGION,
});

const s3 = new AWS.S3();

export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: config.AWS_BUCKET,
    key: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});
