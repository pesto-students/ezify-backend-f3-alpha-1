
import { ApiError, BadRequestError, User } from "@ezzify/common/build";
import express from "express";


export class UpdatedUsersDB {
 
  public updateUserService = (data: any, id: string, res: express.Response) => {
    return new Promise(async (resolve, reject) => {
      try {
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
}


