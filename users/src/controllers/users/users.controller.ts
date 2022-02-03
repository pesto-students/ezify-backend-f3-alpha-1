import express from "express";
import {
  BaseController,
  Controller,
  validationMiddleware,
  sanitizeBody,
  SuccessResponse,
  UsersDto,
  UserBodyInterface,
  UsersProps,
  UsersDB,
  VerifyDto,
  verifyProps,
  VerifyInterface,
  upload,
  auth,
  SuccessMsgResponse,
} from "@ezzify/common/build";

import { UpdateUsersDto } from "../services/updateUser/updateUser.dto";
import { UpdateUsersProps } from "../services/updateUser/updateUser.props";
import { UpdatedUsersDB } from "../services/users.db";

export class UserController extends BaseController implements Controller {
  public path = "/users";
  public router = express.Router();

  private db: UsersDB;
  private userdb: UpdatedUsersDB;

  constructor() {
    super();
    this.db = new UsersDB();
    this.userdb = new UpdatedUsersDB();
    this._initializeRoutes();
  }

  private _initializeRoutes = () => {
    this.router.post(`${this.path}/signup`, validationMiddleware(UsersDto), this.signupUser);
    this.router.post(`${this.path}/verify`, validationMiddleware(VerifyDto), this.verifyUser);
    this.router.patch(`${this.path}/update_user`, validationMiddleware(UpdateUsersDto), upload.single("file"), auth(["user"]), this.updateUser);
    this.router.post(`${this.path}/book_service`, auth(["user"]), this.userBooking);
    this.router.get(`${this.path}/get_active_bookings`, auth(["user"]), this.findActiveBookings);
    this.router.get(`${this.path}/get_all_bookings`, auth(["user"]), this.findAllBookings);
    this.router.post(`${this.path}/toggle_status`, auth(["user"]), this.toggleStatus);
    this.router.post(`${this.path}/filterVendors`, this.findVendorsByService);
    this.router.get(`${this.path}/findCities`, this.findCities);

    this.router.get(`${this.path}/viewAllOrders`, auth(["user"]), this.findAllOrders);
    this.router.get(`${this.path}/view_notifiactions`, auth(["vendor", "admin", "user"]), this.findNotification);
    this.router.post(`${this.path}/toggle_notifiactions`, auth(["vendor", "admin", "user"]), this.toggleNotification);
    this.router.get(`${this.path}/markAsRead`, auth(["vendor", "user", "admin"]), this.markAsReadNotification);
  };

  private signupUser = this.catchAsyn(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { email, role } = sanitizeBody(UsersProps, req.body);
    // const { SENDGRID_API_KEY, SENDGRID_SENDER_EMAIL } = process.env;

    // const result = await this.db.signupUser(email, role, SENDGRID_API_KEY, SENDGRID_SENDER_EMAIL, res);

    const result = await this.db.signupUser(email, role, res);

    new SuccessResponse("success", result).send(res);
  });

  private verifyUser = this.catchAsyn(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { id, otp } = sanitizeBody(verifyProps, req.body) as VerifyInterface;

    const result = await this.db.verifyOtpService({ id, otp }, res);

    new SuccessResponse("success", result).send(res);
  });

  private updateUser = this.catchAsyn(async (req: any, res: express.Response, next: express.NextFunction) => {
    req.body = sanitizeBody(UpdateUsersProps, req.body);

    let newDetails = { ...req.body, profileImage: req?.file?.location };

    const result = await this.userdb.updateUserService(newDetails, req.user._id, res);
    new SuccessResponse("success", result).send(res);
  });

  private userBooking = this.catchAsyn(async (req: any, res: express.Response, next: express.NextFunction) => {
    let bookingData = { ...req.body };

    const bookService = await this.userdb.createBookingService(bookingData, req.user._id, res);

    new SuccessResponse("success", bookService).send(res);
  });

  private findActiveBookings = this.catchAsyn(async (req: any, res: express.Response, next: express.NextFunction) => {
    const activeBookings = await this.userdb.getAllActiveBookings(req.user._id, res);

    new SuccessResponse("success", activeBookings).send(res);
  });

  private findAllBookings = this.catchAsyn(async (req: any, res: express.Response, next: express.NextFunction) => {
    const allBookings = await this.userdb.getAllBookings(req.user._id, res);

    new SuccessResponse("success", allBookings).send(res);
  });

  private toggleStatus = this.catchAsyn(async (req: any, res: express.Response, next: express.NextFunction) => {
    let toggleData = { ...req.body };

    const toggleStatus = await this.userdb.toggleBookingStatus(toggleData, req.user._id, res);

    new SuccessResponse("success", toggleData).send(res);
  });

  private findVendorsByService = this.catchAsyn(async (req: any, res: express.Response, next: express.NextFunction) => {
    const Data = { ...req.body };

    const showVendors = await this.userdb.searchVendorByService(Data, res);

    new SuccessResponse("success", showVendors).send(res);
  });

  private findCities = this.catchAsyn(async (req: any, res: express.Response, next: express.NextFunction) => {
    const showCities = await this.userdb.getCitites(res);

    new SuccessResponse("success", showCities).send(res);
  });

  private findAllOrders = this.catchAsyn(async (req: any, res: express.Response, next: express.NextFunction) => {
    const showOrders = await this.userdb.viewOrders(req.user._id, res);

    new SuccessResponse("success", showOrders).send(res);
  });

  private findNotification = this.catchAsyn(async (req: any, res: express.Response, next: express.NextFunction) => {
    const getNotification = await this.userdb.getNotifications(req.user._id, res);

    new SuccessResponse("success", getNotification).send(res);
  });

  private toggleNotification = this.catchAsyn(async (req: any, res: express.Response, next: express.NextFunction) => {
    const toggleNotification = await this.userdb.toggleNotification(req.body.id, res);

    new SuccessResponse("success", toggleNotification).send(res);
  });

  private markAsReadNotification = this.catchAsyn(async (req: any, res: express.Response, next: express.NextFunction) => {
    const markAsReadNotification = await this.userdb.markAsReadNotification(req.user._id, res);

    new SuccessMsgResponse("success").send(res);
  });
}
