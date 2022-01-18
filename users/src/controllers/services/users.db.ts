
import { ApiError, BadRequestError, User, Bookings } from "@ezzify/common/build";
import express from "express";


export class UpdatedUsersDB {
 
  public updateUserService = (data: any, id: string, res: express.Response) => {
    return new Promise(async (resolve, reject) => {
      try {
      //    const createBookingId = await Bookings.create({});
        
        let updatedObject = { ...data, profileImage: data.profileImage};
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

  // public addBookingService = (data: any, id: string, res: express.Response) => {
  //   return new Promise(async (resolve, reject) => {
  //     try {
        
      
  //       const findVendor = await User.findById(data.vendorId);
  //    //   console.log(findVendor);
        
  //       if(!findVendor) {
  //         ApiError.handle(new BadRequestError("vendor not found!"),res);
  //         return;
  //       }
  //       const findServices = await findVendor.services.find((x:any) => x.serviceID == data.serviceID);
  //       console.log(findServices?.basePrice);
        
  //       const updateBooking = await Bookings.findByIdAndUpdate(id, {
  //         $addToSet: {bookings:{serviceID: data.serviceID, vendorID: data.vendorId}},
  //         $inc: {total_amount: findServices?.basePrice}
  //       }, { new: true });

  //       if(!updateBooking){
  //         ApiError.handle(new BadRequestError("cannot booked this vendor"),res);
  //         return;
  //       }

  //       resolve(updateBooking);
  //     } catch (err: any) {
  //       ApiError.handle(err, res);
  //     }
  //   })
  // }

public createBookingService = (data:any, id:string, res: express.Response) => {
  return new Promise(async (resolve, reject) => {

    try {
      
    const  bookingObj = {...data};

      
  

   
        //@ts-ignore
      const findVendor = await User.find({
        $and: [
          { 
            '_id': { $in: data.vendorId }
          },
          {
            roles: "vendor"
          }
        ]
      });

   //  console.log(findVendor);

      for(let service of findVendor) {
        console.log(service.services);
        
      }

      // if(findVendor?.roles !== "vendor") {
      //   ApiError.handle(new BadRequestError("No vendor found with this ID !!"),res);
      //   return;
      // }

      // const findServices = await findVendor.services.find((x:any) => x.serviceID == data.serviceID);

      // if(!findServices) {
      //   ApiError.handle(new BadRequestError("no service found for this vendor"),res);
      //   return;
      // }
      // const createBooking = await Bookings.create({bookings:{serviceID:data.serviceID,vendorID: data.vendorId},total_amount: findServices?.basePrice, userID: id});

      // if(!createBooking) {
      //   ApiError.handle(new BadRequestError("cannot book this vendor right now! Please try again later"),res);
      //   return;
      // }

      // const populatedData = await (await createBooking.populate({ path: "bookings", populate: { path: "serviceID" } })).populate({path: "bookings",populate: {path: "vendorID"}});

      // resolve(populatedData);
      
    } catch (err:any) {
      ApiError.handle(err, res);
    }
  })
}

}


