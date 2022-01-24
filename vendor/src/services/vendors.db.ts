import { ApiError, BadRequestError, User, Bookings, Payment,Notification } from "@ezzify/common/build";
import { createChannel, publishMessage } from "../amqplib/connection";
import amqplib from "amqplib";
import express from "express";

export class VendorDB {
  public channel: amqplib.Channel | undefined;
  constructor() {
    this.initChannel();
  }
  private async initChannel() {
    this.channel = await createChannel();
  }

  public updateVendor = (id: string, data: any, res: express.Response) => {
    return new Promise(async (resolve, reject) => {
      try {
        let Data = { ...data, profileImage: data.profileImage, adharCardImage: data.adharCardImage, panCardImage: data.panCardImage };

        const updatedVendor = await User.findByIdAndUpdate(id, Data, { new: true });

        if (!updatedVendor) {
          return ApiError.handle(new BadRequestError("cannot update the vendor profile"), res);
        }

        const admin = await User.find({roles: "admin"});

        const queueData = { room: admin[0]._id, data: {updatedVendor}, event: "NEW_ORDER" };
        publishMessage(this.channel, "NEW_ORDER", JSON.stringify(queueData));

        const createNotification = await Notification.create({
          to: admin[0]._id,
          from: id,
          data: queueData
        });

        resolve(updatedVendor);
      } catch (err: any) {
        ApiError.handle(err, res);
      }
    });
  };

  public viewAllBookings = (id: string, res: express.Response) => {
    return new Promise(async (resolve, reject) => {
      try {
        const bookings = await Payment.find({ vendorID: id }).sort({_id: -1});
        resolve(bookings);
      } catch (err: any) {
        ApiError.handle(err, res);
      }
    });
  };

  public viewActiveBookings = (id: string, res: express.Response) => {
    return new Promise(async (resolve, reject) => {
      try {
        const bookings = await Bookings.aggregate([
          {
            $match: {
              "bookings.vendorID": id,
            },
          },
          {
            $unwind: "$bookings",
          },
          {
            $match: {
              $and: [
                {
                  "bookings.vendorID": id,
                },
                {
                  status: "active",
                },
              ],
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "userID",
              foreignField: "_id",
              as: "user_info",
            },
          },
          {
            $lookup: {
              from: "services",
              localField: "bookings.serviceID",
              foreignField: "_id",
              as: "service_info",
            },
          },
        ]);

        if (!bookings.length) {
          ApiError.handle(new BadRequestError("no bookings found for this vendor"), res);
          return;
        }

        resolve(bookings);
      } catch (err: any) {
        ApiError.handle(err, res);
      }
    });
  };

  public viewCompletedBookings = (id: string, res: express.Response) => {
    return new Promise(async (resolve, reject) => {
      try {
        const bookings = await Bookings.aggregate([
          {
            $match: {
              "bookings.vendorID": id,
            },
          },
          {
            $unwind: "$bookings",
          },
          {
            $match: {
              $and: [
                {
                  "bookings.vendorID": id,
                },
                {
                  status: "completed",
                },
              ],
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "userID",
              foreignField: "_id",
              as: "user_info",
            },
          },
          {
            $lookup: {
              from: "services",
              localField: "bookings.serviceID",
              foreignField: "_id",
              as: "service_info",
            },
          },
        ]);

        if (!bookings.length) {
          ApiError.handle(new BadRequestError("no bookings found for this vendor"), res);
          return;
        }

        resolve(bookings);
      } catch (err: any) {
        ApiError.handle(err, res);
      }
    });
  };

  public viewAllEarnings = (id: string, res: express.Response) => {
    return new Promise(async (resolve, reject) => {
      try {
        const viewAllvendors = await Payment.aggregate([
          {
            $match: {
              vendorID: id,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "userID",
              foreignField: "_id",
              as: "user_info",
            },
          },
          {
            $lookup: {
              from: "services",
              localField: "serviceID",
              foreignField: "_id",
              as: "service_info",
            },
          },
        ]).sort({_id: -1});

        if (!viewAllvendors.length) {
          ApiError.handle(new BadRequestError("NO payement found for this vendor"), res);
          return;
        }

        resolve(viewAllvendors);
      } catch (err: any) {
        ApiError.handle(err, res);
      }
    });
  };

  public totalEarnings = (id: string, res: express.Response) => {
    return new Promise(async (resolve, reject) => {
      try {
        const viewvendors = await Payment.aggregate([
          {
            $match: {
              vendorID: id,
            },
          },
          {
            $group: {
              _id: null,
              total_earning: { $sum: "$baseprice"}
            },
          }
        ]);        
        if (!viewvendors.length) {
          ApiError.handle(new BadRequestError("No payment found for this vendor"), res);
          return;
        }

        const total_booking = await Payment.find({vendorID:id});

        if(!total_booking.length){
          ApiError.handle(new BadRequestError("somerthing went wrong"),res);
          return;
        }

        resolve({total_earn: viewvendors, total_booking: total_booking.length });
      } catch (err: any) {
        ApiError.handle(err, res);
        return;
      }
    });
  };

  public approveBooking = (data: any, res: express.Response) => {
    return new Promise(async (resolve, reject) => {
      try {
        const findVendor = await Payment.findByIdAndUpdate(data.id, { $set: { status: data.status } }, { new: true });
        

        if (!findVendor) {
          ApiError.handle(new BadRequestError("something went wrong in toggling status"), res);
          return;
        }

        const queueData = { room: findVendor?.userID, data: {status: data.status}, event: "NEW_ORDER" };
        publishMessage(this.channel, "NEW_ORDER", JSON.stringify(queueData));

        const createNotification = await Notification.create({
          to: findVendor.userID,
          from: findVendor.vendorID,
          data: queueData
        })

        // if(!createNotification) {
        //   ApiError.handle(new BadRequestError("something went wrong in createNotification"),res);
        //   return;
        // }

        resolve(findVendor);
      } catch (err: any) {
        ApiError.handle(err, res);
        return;
      }
    });
  };
}
