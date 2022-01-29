import { ApiError, BadRequestError, Services, User, Notification } from "@ezzify/common/build";
import express from "express";
import { createChannel, publishMessage } from "../amqplib/connection";
import amqplib from "amqplib";

export class ServicesDB {
  public channel: amqplib.Channel | undefined;
  constructor() {
    this.initChannel();
  }
  private async initChannel() {
    this.channel = await createChannel();
  }
  public createServices = (data: any, res: express.Response) => {
    return new Promise(async (resolve, reject) => {
      try {
        let createData = { ...data, image: data.image };
        const newService = await Services.create(createData);

        if (!newService) {
          ApiError.handle(new BadRequestError("Service data provided not correct"), res);
          return;
        }

        resolve(newService);
      } catch (err: any) {
        ApiError.handle(err, res);
      }
    });
  };

  public viewServices = (req: express.Request, res: express.Response) => {
    return new Promise(async (resolve, reject) => {
      try {
        const viewServices = await Services.find({}).sort({ _id: -1});

        // if (!viewServices) {
        //   ApiError.handle(new BadRequestError("Failed to fetch services from database"), res);
        //   return;
        // }

        resolve(viewServices);
      } catch (err: any) {
        ApiError.handle(err, res);
      }
    });
  };

  public updateServices = (data: any, id: string, res: express.Response) => {
    return new Promise(async (resolve, reject) => {
      try {
        let updatedData = { ...data, image: data.image };
        const updateService = await Services.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updateService) {
          ApiError.handle(new BadRequestError("Cannot update service , something went wrong!"), res);
          return;
        }

        resolve(updateService);
      } catch (err: any) {
        ApiError.handle(err, res);
      }
    });
  };

  public deleteService = (id: string, res: express.Response) => {
    return new Promise(async (resolve, reject) => {
      try {
        const deleteService = await Services.findByIdAndDelete(id);

        if (!deleteService) {
          ApiError.handle(new BadRequestError("Cannot delete the service, something went wrong"), res);
          return;
        }
        resolve(deleteService);
      } catch (err: any) {
        ApiError.handle(err, res);
      }
    });
  };

  public approveVendor = (id: string, vendorid: string, data: boolean, res: express.Response) => {
    return new Promise(async (resolve, reject) => {
      try {
        const approveVendor = await User.findByIdAndUpdate(vendorid, { $set: { isApproved: data } }, { new: true });

        if (!approveVendor) {
          ApiError.handle(new BadRequestError("cannot toogle the isApproved flag!"), res);
          return;
        }

        // const queueData = { room: vendorid, data: { isApproved: data }, event: "NEW_ORDER" };
        // publishMessage(this.channel, "NEW_ORDER", JSON.stringify(queueData));

        // const createNotification = await Notification.create({
        //   to: vendorid,
        //   from: id,
        //   data: queueData,
        //   type: 'VENDOR_APPROVED'
        // });

        resolve(approveVendor);
      } catch (err: any) {
        ApiError.handle(err, res);
      }
    });
  };

  public list_of_vendors = (res: express.Response) => {
    return new Promise(async (resolve, reject) => {
      try {
        const viewVendors = await User.find({ roles: "vendor" }).sort({_id: -1});

        if (!viewVendors) {
          ApiError.handle(new BadRequestError("no vendors found!"), res);
          return;
        }

        resolve(viewVendors);
      } catch (err: any) {
        ApiError.handle(err, res);
      }
    });
  };
}
