
import { ApiError, BadRequestError, User } from "@ezzify/common/build";
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
    }
 
}
