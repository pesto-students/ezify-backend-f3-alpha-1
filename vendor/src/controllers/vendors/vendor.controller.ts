import express from "express";
import {
  BaseController,
  Controller,
  validationMiddleware,
  sanitizeBody,
  Security,
  SuccessResponse,
  SuccessMsgResponse,
  ApiError,
  NotFoundError,
  UsersDto,
  UserBodyInterface,
  UsersProps,
  UsersDB,
  VendorDB,
  VerifyDto,
  verifyProps,
  VerifyInterface,
  upload,
  auth,
  UpdateVendorDto,
  UpdateVendorProps,
} from "@ezzify/common/build";

export class VendorController extends BaseController implements Controller {
  public path = "/vendor";
  public router = express.Router();

  private db: VendorDB;

  constructor() {
    super();
    this.db = new VendorDB();
    this._initializeRoutes();
  }

  private _initializeRoutes = () => {
    this.router.patch(`${this.path}/update_vendor`, validationMiddleware(UpdateVendorDto), upload.array("file"), auth(["vendor"]), this.updateVendor);
  };

  private updateVendor = this.catchAsyn(async (req: any, res: express.Response, next: express.NextFunction) => {
    req.body = sanitizeBody(UpdateVendorProps, req.body);
    let newDetails = { ...req.body, profileImage: req?.file?.location, adharCardImage: req?.file?.location, panCardImage: req?.file?.location };

    const result = await this.db.updateVendor(req.user._id, newDetails, res);
    new SuccessResponse("success", result).send(res);
  });
}
