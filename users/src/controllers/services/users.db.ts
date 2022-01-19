import { ApiError, BadRequestError, User, Bookings, generateOtp, set } from "@ezzify/common/build";
import express, { response } from "express";
import Razorpay from "razorpay";

export class UpdatedUsersDB {
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
        let total_amount = 0;
        const currency = "INR";
        const payment_capture = 1;

        const vendorIds = data.map((x: any) => x.vendorID);

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

        for (let booking of data) {
          const vendor: any = findVendor.find((x: any) => x._id == booking.vendorID);

          if (!vendor) {
            ApiError.handle(new BadRequestError("something went wrong with vendorID please check again."), res);
            return;
          }

          const service = vendor.services.find((x: any) => x.serviceID == booking.serviceID);

          if (!service) {
            return ApiError.handle(new BadRequestError("no service found for this vendor!!"), res);
          }

          total_amount += service.basePrice;
        }

        const options = {
          amount: total_amount * 100,
          currency,
          receipt: generateOtp(),
          payment_capture,
        };

        const razPayData = await this.razorpay.orders.create(options);

        const createBooking = await Bookings.create({
          total_amount: total_amount,
          userID: id,
          bookings: data,
          payment_id: razPayData.id,
        });

        if (!createBooking) {
          ApiError.handle(new BadRequestError("cannot book this vendor right now! Please try again later"), res);
          return;
        }

        const populatedData = await (
          await createBooking.populate({ path: "bookings", populate: { path: "serviceID" } })
        ).populate({ path: "bookings", populate: { path: "vendorID" } });

        resolve(populatedData);
      } catch (err: any) {
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

        if (!findActiveBookings.length) {
          ApiError.handle(new BadRequestError("no active bookings found"), res);
          return;
        }

        resolve(findActiveBookings);
      } catch (err: any) {
        ApiError.handle(err, res);
      }
    });
  };

  public getAllBookings = (id: string, res: express.Response) => {
    return new Promise(async (resolve, reject) => {
      try {
        const findAllBookings = await Bookings.find({ userID: id });

        if (!findAllBookings.length) {
          ApiError.handle(new BadRequestError("No bookings found for this user"), res);
          return;
        }

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

        if (!vendors.length) {
          ApiError.handle(new BadRequestError("No vendors found for this service"), res);
          return;
        }

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
  }
}
