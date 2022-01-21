
import { ApiError, BadRequestError, User, Bookings,Payment } from "@ezzify/common/build";
import express from "express";

export class VendorDB {

    public updateVendor = (id:string, data: any, res: express.Response) => {
        return new Promise(async (resolve, reject) => {
            try {
                let Data = { ...data, profileImage: data.profileImage, adharCardImage: data.adharCardImage, panCardImage: data.panCardImage };
                                
                const updatedVendor = await User.findByIdAndUpdate(id, Data, { new: true });
                 
                if (!updatedVendor) {
                    return ApiError.handle(new BadRequestError("cannot update the vendor profile"), res);
                }

                resolve(updatedVendor);
                
            } catch (err:any) {
                ApiError.handle(err, res);
            }
        })
    };

    public viewAllBookings = (id:string,res: express.Response) => {
        return new Promise(async(resolve, reject) => {

            try {

                const bookings = await Bookings.aggregate([
                    {
                        $match: {
                            "bookings.vendorID": id
                        }
                    },
                    {
                        $unwind:  "$bookings"
                        
                    },
                    {
                        $match: {
                            "bookings.vendorID": id
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "userID",
                            foreignField: "_id",
                            as: "user_info"
                        }
                    },
                    // {
                    //     $lookup: {
                    //         from: "users",
                    //         localField: "bookings.vendorID",
                    //         foreignField: "_id",
                    //         as: "vendor_info"
                    //     }
                    // },
                   
                    {
                        $lookup: {
                            from: "services",
                            localField: "bookings.serviceID",
                            foreignField: "_id",
                            as: "service_info"
                        }
                    },
                   

                ]);

                

                if(!bookings.length){
                    ApiError.handle(new BadRequestError("No bookings found for this vendor"),res);
                    return;
                }

                resolve(bookings);
            } catch (err:any) {

                ApiError.handle(err, res);
                
            }

        })
    };
 
    public viewActiveBookings = (id:string,res: express.Response) => {
        return new Promise(async(resolve, reject) => {

            try {
                
                const bookings = await Bookings.aggregate([
                    {
                        $match: {
                            "bookings.vendorID": id
                        }
                    },
                    {
                        $unwind:  "$bookings"
                        
                    },
                    {
                        $match: {
                            $and: [
                                {
                                    "bookings.vendorID": id
                                },
                                {
                                    status: "active"
                                }
                            ]
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "userID",
                            foreignField: "_id",
                            as: "user_info"
                        }
                    },
                    {
                        $lookup: {
                            from: "services",
                            localField: "bookings.serviceID",
                            foreignField: "_id",
                            as: "service_info"
                        }
                    }

                ])

                if(!bookings.length) {
                    ApiError.handle(new BadRequestError("no bookings found for this vendor"),res);
                    return;
                }

                resolve(bookings);
            } catch (err:any) {

                ApiError.handle(err, res);
                
            }

        })
    };

    public viewCompletedBookings = (id:string,res: express.Response) => {
        return new Promise(async(resolve, reject) => {

            try {
                
                const bookings = await Bookings.aggregate([
                    {
                        $match: {
                            "bookings.vendorID": id
                        }
                    },
                    {
                        $unwind:  "$bookings"
                        
                    },
                    {
                        $match: {
                            $and: [
                                {
                                    "bookings.vendorID": id
                                },
                                {
                                    status: "completed"
                                }
                            ]
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "userID",
                            foreignField: "_id",
                            as: "user_info"
                        }
                    },
                    {
                        $lookup: {
                            from: "services",
                            localField: "bookings.serviceID",
                            foreignField: "_id",
                            as: "service_info"
                        }
                    }

                ])

                if(!bookings.length) {
                    ApiError.handle(new BadRequestError("no bookings found for this vendor"),res);
                    return;
                }

                resolve(bookings);
            } catch (err:any) {

                ApiError.handle(err, res);
                
            }

        })
    };


public viewAllEarnings = (id:string, res: express.Response) => {
    return new Promise(async(resolve, reject) => {

        try {

            const viewAllvendors = await Payment.aggregate([
                {
                    $match: {
                        vendorID: id, 
                    }
                },
                {
                    $group: {
                        _id: null,
                        total_earning: {$sum: "$baseprice"}
                    }
                }
            ]);

            if(!viewAllvendors.length){
                ApiError.handle(new BadRequestError("NO payement found for this vendor"),res);
                return;
            }
            
        resolve(viewAllvendors);

        } catch (err: any) {
            ApiError.handle(err, res);
        }
    })
}



}
