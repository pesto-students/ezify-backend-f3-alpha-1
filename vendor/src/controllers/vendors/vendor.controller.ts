import express from "express";
import {
  BaseController,
  Controller,
  SuccessResponse,
  upload,
  auth,
  validationMiddleware,
  sanitizeBody,
} from "@ezzify/common/build";
import { VendorDB } from "../../services/vendors.db";
import { UpdateVendorDto } from "../../services/updateVendor/updateVendor.dto";
import { UpdateVendorProps } from "../../services/updateVendor/updateVendor.props";

//import { VendorDB } from "../../vendor.services";

export class VendorController extends BaseController implements Controller {
  public path = "/vendor";
  public router = express.Router();

  uploadFields = [{ name: "profileImage" }, { name: "adharCardImage" }, { name: "panCardImage" }];

  private db: VendorDB;

  constructor() {
    super();
    this.db = new VendorDB();
    this._initializeRoutes();
  }

  private _initializeRoutes = () => {
    this.router.patch(`${this.path}/update_vendor`,validationMiddleware(UpdateVendorDto),upload.fields(this.uploadFields),auth(["vendor"]),this.updateVendor);
  };

  private updateVendor = this.catchAsyn(async (req: any, res: express.Response, next: express.NextFunction) => {
     req.body = sanitizeBody(UpdateVendorProps, req.body);

    const { profileImage, adharCardImage, panCardImage } = req.files;

    let newDetails = { ...req.body };    
    
    profileImage ? (newDetails.profileImage = profileImage[0].location) : null;
    adharCardImage ? (newDetails.adharCardImage = adharCardImage[0].location) : null;
    panCardImage ? (newDetails.panCardImage = panCardImage[0].location) : null;

    const result = await this.db.updateVendor(req.user._id, newDetails, res);
    new SuccessResponse("success", result).send(res);
  });
}
