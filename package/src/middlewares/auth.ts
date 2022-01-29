// will move to common package
import express from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { ApiError, AuthFailureError, ForbiddenError, NotFoundError } from "../core/apiError.core";
import User from "../database/repository/users/users.model";
import { decodedJWT } from "../interfaces/auth/jwt.interface";

const { ENCRYPTION_KEY } = config;

const auth = (roles: any) => async (req: any, res: express.Response, next: express.NextFunction) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const { _id } = jwt.verify(token, ENCRYPTION_KEY) as decodedJWT;

    var user = await User.findOne({ _id, "tokens.token": token });

    if (!user) return ApiError.handle(new NotFoundError("User not found"), res);

    req.token = token;
    req.user = user;

    if (roles.indexOf(req.user.roles) === -1) {
      return ApiError.handle(new ForbiddenError(), res);
    }

    next();
  } catch (e) {
    return ApiError.handle(new AuthFailureError("Authentication failed"), res);
  }
};

export default auth;
