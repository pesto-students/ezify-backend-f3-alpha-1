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
    this.router.get(`${this.path}/viewall_bookings`, auth(["vendor"]), this.viewAllBookings);
    this.router.get(`${this.path}/viewall_active_bookings`, auth(["vendor"]), this.viewActiveBookings);
    this.router.get(`${this.path}/viewall_complete_bookings`, auth(["vendor"]), this.viewCompletedBookings);
    this.router.get(`${this.path}/view_earnings`, auth(["vendor"]), this.viewAllEarnings);
    this.router.get(`${this.path}/total_earnings`, auth(["vendor"]), this.totalEarnings);
    this.router.post(`${this.path}/toggle_status`, auth(["vendor"]), this.toggleBookingStatus);



  };

  private updateVendor = this.catchAsyn(async (req: any, res: express.Response, next: express.NextFunction) => {
     req.body = sanitizeBody(UpdateVendorProps, req.body);

    const { profileImage, adharCardImage, panCardImage } = req.files;

    let newDetails = { ...req.body };    
    
    profileImage ? (newDetails.profileImage = profileImage[0].location) : req.user.profileImage;
    adharCardImage ? (newDetails.adharCardImage = adharCardImage[0].location) : req.user.adharCardImage;
    panCardImage ? (newDetails.panCardImage = panCardImage[0].location) : req.user.panCardImage;

    const result = await this.db.updateVendor(req.user._id, newDetails, res);
    new SuccessResponse("success", result).send(res);
  });

  private viewAllBookings = this.catchAsyn(async (req: any, res: express.Response, next: express.NextFunction) => {

    const viewAllBookings = await this.db.viewAllBookings(req.user._id,res);

    new SuccessResponse("success", viewAllBookings).send(res);
  });

  private viewActiveBookings = this.catchAsyn(async (req: any, res: express.Response, next: express.NextFunction) => {

    const viewActiveBookings = await this.db.viewActiveBookings(req.user._id,res);

    new SuccessResponse("success", viewActiveBookings).send(res);
  });

  private viewCompletedBookings = this.catchAsyn(async (req: any, res: express.Response, next: express.NextFunction) => {

    const viewAcompleteBookings = await this.db.viewCompletedBookings(req.user._id,res);

    new SuccessResponse("success", viewAcompleteBookings).send(res);
  });

  private viewAllEarnings = this.catchAsyn(async (req: any, res: express.Response, next: express.NextFunction) => {

    const viewEarning = await this.db.viewAllEarnings(req.user._id,res);

    new SuccessResponse("success", viewEarning).send(res);
  });

  private totalEarnings = this.catchAsyn(async (req: any, res: express.Response, next: express.NextFunction) => {

    const totalEarnings = await this.db.totalEarnings(req.user._id,res);

    new SuccessResponse("success", totalEarnings).send(res);
  });

  private toggleBookingStatus = this.catchAsyn(async (req: any, res: express.Response, next: express.NextFunction) => {

    const data = {...req.body};

    const toggleStatus = await this.db.approveBooking(data,res);

    new SuccessResponse("success", toggleStatus).send(res);
  })

}
