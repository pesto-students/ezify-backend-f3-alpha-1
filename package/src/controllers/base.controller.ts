import express from "express";
import mongoose from "mongoose";
import { ApiError } from "../core/apiError.core";

export abstract class BaseController {
  /**
   * wrapper function to handle catch condition on all async functions
   * @param fn any
   * @returns fn
   */
  protected catchAsyn = (fn: any) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      fn(req, res, next).catch((err: any) => {
        return ApiError.handle(err, res);
      });
    };
  };

  /**
   * A generic function to create a document using model
   * @param postData data to be saved in the collection
   * @param Model schema of the object
   * @param res response
   * @returns newly created document
   */
  protected createDocument = async (postData: any, Model: mongoose.Model<mongoose.Document>, res: express.Response) => {
    try {
      const newDoc = await Model.create(postData);
      return newDoc;
    } catch (err) {
      // @ts-ignore
      ApiError.handle(err, res);
    }
  };
}
