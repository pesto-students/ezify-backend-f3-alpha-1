import { ApiError, BadRequestError, User, Bookings, generateOtp, Payment,Notification } from "@ezzify/common/build";
import express, { response } from "express";
import { model } from "mongoose";
import Razorpay from "razorpay";
import { createChannel, publishMessage } from "../../amqplib/connection";
import amqplib from "amqplib";
export class UpdatedUsersDB {

  public channel:  amqplib.Channel| undefined;
  constructor(){
    this.initChannel();
  }
  private async initChannel() {
    this.channel = await createChannel();
  }
  private razorpay = new Razorpay({
    key_id: "rzp_test_tu2qVp4NSABRW7",
    key_secret: "zIblQiAH8eFj1sA107Zz2tit",
  });

  public updateUserService = (data: any, id: string, res: express.Response) => {
    return new Promise(async (resolve, reject) => {
      try {
        //    const createBookingId = await Bookings.create({});

        let updatedObject = { ...data, profileImage: data.profileImage };
        const updateUser = await User.findByIdAndUpdate(id, updatedObject, { new: true });

        if (!updateUser) {
          ApiError.handle(new BadRequestError("User not found"), res);
          return;
        }

        resolve(updateUser);
      } catch (err: any) {
        ApiError.handle(err, res);
      }
    });
  };


  public createBookingService = (data: any, id: string, res: express.Response) => {
    return new Promise(async (resolve, reject) => {
      try {
       
       
        const currency = "INR";
        const payment_capture = 1;

    const vendorIds = data.bookings.map((x: any) => x.vendorID);

        const findVendor = await User.find({
          $and: [
            {
              _id: { $in: vendorIds },
            },
            {
              roles: "vendor",
            },
          ],
        });

        for (let booking of data.bookings) {
          const vendor: any = findVendor.find((x: any) => x._id == booking.vendorID);

          

          if (!vendor) {
            ApiError.handle(new BadRequestError("something went wrong with vendorID please check again."), res);
            return;
          }

          const service = vendor.services.find((x: any) => x.serviceID == booking.serviceID);

          if (!service) {
            return ApiError.handle(new BadRequestError("no service found for this vendor!!"), res);
          }

          
        
        }

        const options = {
          amount: data.total_amount * 100,
          currency,
          receipt: generateOtp(),
          payment_capture,
        };

        const razPayData = await this.razorpay.orders.create(options);

        const createBooking = await Bookings.create({
          total_amount: data.total_amount,
          userID: id,
          bookings: data.bookings,
          payment_id: razPayData.id,
        });

        if (!createBooking) {
          ApiError.handle(new BadRequestError("cannot book this vendor right now! Please try again later"), res);
          return;
        }

      for(let book of data.bookings) {
        const vendor: any = findVendor.find((x: any) => x._id == book.vendorID);

        console.log(vendor);

        const payments = await Payment.create({
          serviceID: book.serviceID,
          vendorID: book.vendorID,
          baseprice: book.baseprice,
          userID: id
        });

        if(!payments){
          ApiError.handle(new BadRequestError("failed to save payment logs"),res);
          return;
        }

        const queueData = { room: vendor._id, data: {createBooking}, event: "NEW_ORDER" };
        publishMessage(this.channel, "NEW_ORDER", JSON.stringify(queueData));

        const createNotifcation = await Notification.create({
          to: vendor._id,
          from: id,
          data: queueData
        });

        if(!createNotifcation){
          ApiError.handle(new BadRequestError("cant create notification for the booking"),res);
          return;
        }
      };
       

        const populatedData = await (
          await createBooking.populate({ path: "bookings", populate: { path: "serviceID" } })
        ).populate({ path: "bookings", populate: { path: "vendorID" } });



        resolve(populatedData);
      } catch (err: any) {
        console.log(err);
        
        ApiError.handle(err, res);
      }
    });
  };

  public getAllActiveBookings = (id: string, res: express.Response) => {
    return new Promise(async (resolve, reject) => {
      try {
        const findActiveBookings = await Bookings.find({
          $and: [
            {
              status: "active",
            },
            {
              userID: id,
            },
          ],
        });

        // if (!findActiveBookings.length) {
        //   ApiError.handle(new BadRequestError("no active bookings found"), res);
        //   return;
        // }

        resolve(findActiveBookings);
      } catch (err: any) {
        ApiError.handle(err, res);
      }
    });
  };

  public getAllBookings = (id: string, res: express.Response) => {
    return new Promise(async (resolve, reject) => {
      try {
        const findAllBookings = await Payment.find({ userID: id });


        resolve(findAllBookings);
      } catch (err: any) {
        ApiError.handle(err, res);
      }
    });
  };

  public toggleBookingStatus = (data: any, id: string, res: express.Response) => {
    return new Promise(async (resolve, reject) => {
      try {
        const findBooking = await Bookings.find({
          $and: [
            {
              _id: data.bookingid,
            },
            {
              userID: id,
            },
          ],
        });

        if (!findBooking) {
          ApiError.handle(new BadRequestError("No booking found"), res);
          return;
        }

        const toggle = await findBooking[0].update({ status: data.status });

        if (!toggle) {
          ApiError.handle(new BadRequestError("something went wrong while toggling"), res);
          return;
        }

        resolve(toggle);
      } catch (err: any) {
        ApiError.handle(err, res);
      }
    });
  };

  public searchVendorByService = (data: any, res: express.Response) => {
    return new Promise(async (resolve, reject) => {
      try {
        const vendors = await User.find({
          $and: [
            {
              city: data?.city ? data.city : { $ne: " " },
            },
            {
              "services.serviceID": data.serviceID,
            },
          ],
        });

        // if (!vendors.length) {
        //   ApiError.handle(new BadRequestError("No vendors found for this service"), res);
        //   return;
        // }

        resolve(vendors);
      } catch (err: any) {
        ApiError.handle(err, res);
      }
    });
  };

  public getCitites = (res:express.Response) => {

    return new Promise(async (resolve, reject) => {

      try {
        
        const vendors = await User.find({roles: "vendor"});
        
        if(!vendors.length){
          ApiError.handle(new BadRequestError("No vendor found"),res);
          return;
        }

        const cities:any[] = await vendors.map((x:any) => x.city);

        
        if(!cities) {
          ApiError.handle(new BadRequestError("No cities found"),res);
          return;
        }

        resolve([...new Set(cities)]);
      } catch (err:any) {
        
        ApiError.handle(err, res);
      }

    })
  };

  public viewOrders = (id: string,res: express.Response) => {
    return new Promise(async (resolve, reject) => {

      try {
        
        const totalorders = await Payment.aggregate([
          {
            $match: {
              userID: id
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "vendorID",
              foreignField: "_id",
              as: "vendor_info"
          }
          },
          {
            $lookup: {
              from: "services",
              localField: "serviceID",
              foreignField: "_id",
              as: "service_info"
          }
          }
        ]);

        resolve(totalorders);

      } catch (err:any) {
        ApiError.handle(err, res);
      }
    })
  };

}
