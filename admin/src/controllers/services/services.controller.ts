import express from "express";
import { BaseController, Controller, validationMiddleware, sanitizeBody, SuccessResponse, upload, auth } from "@ezzify/common/build";
import { ServicesDB } from "../../services/services.db";
import { DeleteServiceDto } from "../../services/deleteService/deleteServic.dto";
import { DeleteServiceProps } from "../../services/deleteService/deleteService.props";
import { ServiceDto } from "../../services/createServices/service.dto";
import { ServiceProps } from "../../services/createServices/services.props";
import { UpdateServiceDto } from "../../services/updateServices/updateService.dto";
import { UpdateServiceProps } from "../../services/updateServices/updateService.props";
import { IsApprovedDto } from "../../services/isApproved/isApproved.dto";
import { IsApprovedProps } from "../../services/isApproved/isApproved.props";

export class AdminController extends BaseController implements Controller {
  public path = "/v1";
  public router = express.Router();

  private db: ServicesDB;

  constructor() {
    super();
    this.db = new ServicesDB();
    this._initializeRoutes();
  }

  private _initializeRoutes = () => {
    // this.router.post(`${this.path}/signup`, validationMiddleware(UsersDto), this.signupUser);
    this.router.post(`${this.path}/create_service`,  upload.single("image"), auth(["admin"]), this.createServices);
    this.router.get(`${this.path}/view_service`, this.viewServices);
    this.router.patch(
      `${this.path}/update_service/:id`,
      upload.single("file"),
      auth(["admin"]),
      this.updateServices
    );
    this.router.delete(`${this.path}/delete_service/:id`,validationMiddleware(DeleteServiceDto), auth(["admin"]), this.deleteService);
    this.router.post(`${this.path}/approve_vendor/:id`, validationMiddleware(IsApprovedDto), auth(["admin"]), this.approveVendor);
    this.router.get(`${this.path}/list_all_vendors`, auth(["admin"]), this.listAllVendors);
  };

  private createServices = this.catchAsyn(async (req: any, res: express.Response, next: express.NextFunction) => {
    
    
    req.body = sanitizeBody(ServiceProps, req.body);

    let createData = { ...req.body, image: req?.file?.location };

    const createService = await this.db.createServices(createData, res);

    new SuccessResponse("success", createService).send(res);
  });

  private viewServices = this.catchAsyn(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const viewServices = await this.db.viewServices(req, res);

    new SuccessResponse("success", viewServices).send(res);
  });

  private updateServices = this.catchAsyn(async (req: any, res: express.Response, next: express.NextFunction) => {
    req.body = sanitizeBody(UpdateServiceProps, req.body);

    const serviceID = req.params.id;

    let updatedObject = { ...req.body, image: req?.file?.location };

    const updateService = await this.db.updateServices(updatedObject, serviceID, res);

    new SuccessResponse("success", updateService).send(res);
  });

  private deleteService = this.catchAsyn(async (req: any, res: express.Response, next: express.NextFunction) => {
    req.body = sanitizeBody(DeleteServiceProps, req.body);

    const serviceID = req.params.id;

    const deleteService = await this.db.deleteService(serviceID, res);

    new SuccessResponse("success", deleteService).send(res);
  });

  private approveVendor = this.catchAsyn(async (req: any, res: express.Response, next: express.NextFunction) => {

        req.body = sanitizeBody(IsApprovedProps, req.body);
    const vendorID = req.params.id;

    const approveVendor = await this.db.approveVendor(vendorID, req.body.isApproved, res);

    new SuccessResponse("success", approveVendor).send(res);
  });

  private listAllVendors = this.catchAsyn(async (req: any, res: express.Response, next: express.NextFunction) => {

    const viewAllVendors = await this.db.list_of_vendors(res);

    new SuccessResponse("success", viewAllVendors).send(res);
  })
}
