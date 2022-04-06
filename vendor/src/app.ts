import "dotenv/config";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import useragent from "express-useragent";
import { connectDB, config, ApiError, BadRequestError, InternalError, NotFoundError, Security, Controller } from "@ezzify/common/build";

import { PATH, StatusCode } from "./config";

const { ENVIRONMENT } = config;

class App {
  public app: express.Application;
  public port: string | undefined;

  constructor(controllers: Controller[], port: string | undefined) {
    this.app = express();
    this.port = port;

    this._connectToDatabase();
    this._initalizeMiddlewares();
    this._initalizeControllers(controllers);
    this._initalizeErrorHandling();
  }

  private _connectToDatabase = () => {
    connectDB();
  };

  /**
   * A generic function to attach global level middlewares
   */
  private _initalizeMiddlewares = () => {
    this.app.use(async (req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    // SETTING REQUEST START TIME
    this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.set("start", `${Date.now()}`);
      next();
    });

    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(useragent.express());

    this.app.use(async (req, res, next) => {
      if (
        ENVIRONMENT === "PROD" &&
        req.url !== `${PATH}/security/saltEncryption` &&
        req.url !== `${PATH}/security/encryption` &&
        req.url !== `${PATH}/security/decryption` &&
        req.url !== `${PATH}/logs/activityLogs` &&
        req.url !== `${PATH}/logs/errorActivityLogs` &&
        req.url !== `${PATH}/vendor/update_vendor` &&
        (req.method === "POST" || req.method === "PATCH")
      ) {
        const result = Security.decryption(req.body.data);
        if (result === StatusCode.INVALID_ENCRYPTED_INPUT) {
          ApiError.handle(new BadRequestError("Invalid Encrpted String"), res);
          return;
        } else {
          req.body = result;
        }
      }
      next();
    });
  };

  /**
   * A generic function to attach all the controllers
   * @param controllers
   */
  private _initalizeControllers = (controllers: Controller[]) => {
    controllers.forEach((controller) => {
      this.app.use(PATH, controller.router);
    });
  };

  /**
   * A generic function to handle errors at global level
   */
  private _initalizeErrorHandling = () => {
    // catch 404 and forward to error handler
    this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      return ApiError.handle(new NotFoundError(), res);
    });

    this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (err instanceof ApiError) {
        return ApiError.handle(err, res);
      } else {
        if (ENVIRONMENT === "DEV") {
          return res.status(500).send(err.message);
        }
        return ApiError.handle(new InternalError(), res);
      }
    });
  };

  /**
   * Starting the server
   */
  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port} in ${ENVIRONMENT} env`);
    });
  }
}

export default App;
