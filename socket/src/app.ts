import "dotenv/config";

import amqplib from "amqplib";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import useragent from "express-useragent";
import { connectDB, config, ApiError, BadRequestError, InternalError, NotFoundError, Security, Controller } from "@ezzify/common/build";
import { PATH, StatusCode } from "./config";
import http from "http";

import { Server } from "socket.io";

import { createChannel, publishMessage, subscribeMessage } from "./amqplib/connection";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const { ENVIRONMENT } = config;

class App {
  public app: express.Application;
  public port: string | number | undefined;
  public channel: amqplib.Channel | undefined;
  public io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  private server: http.Server;

  constructor(controllers: Controller[], port: string | number | undefined) {
    this.app = express();
    this.port = port;
    this.server = http.createServer(this.app);
    this._connetToAmqlib();
    this._connectToDatabase();
    this._initalizeMiddlewares();
    this._initalizeControllers(controllers);
    this._initalizeErrorHandling();
    this.io = this.initSocket();
    this._createSocketConnection();
  }

  private _createSocketConnection() {
    this.io.on("connection", (socket) => {
      console.log("socket connected");

      socket.on("join", (room) => {
        console.log("Socket Joined", room);
        socket.join(room);
      });

      socket.on("updateCoordinate", async ({ driver_id, coordinates }) => {
        // console.log("jh", coordinates);
      });
    });
  }

  public service = (payload: string) => {
    const { room, data, event } = JSON.parse(payload);
    console.log({ room, data, event });
    this.io.to(room).emit(event, data);
  };

  private _connectToDatabase = () => {
    connectDB();
  };

  private _connetToAmqlib = async () => {
    this.channel = await createChannel();
    await subscribeMessage(this.channel, "NEW_ORDER", this.service);
  };

  /**
   * A generic function to attach global level middlewares
   */
  private _initalizeMiddlewares = () => {
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
        req.url !== `${PATH}/logs/errorActivityLogs`
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

  private initSocket() {
    return new Server(this.server, {
      /* options */
      cors: {
        origin: "*:*",
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ["websocket", "polling"],
      path: "/mysocket/",
      allowEIO3: true,
    });
  }

  /**
   * Starting the server
   */
  public listen() {
    this.server.listen(this.port, () => {
      console.log("Socket service listening on port" + this.port);
    });
    this.server.on("error", this.onError);
  }

  private onError(error: any) {
    if (error.syscall !== "listen") {
      throw error;
    }

    var bind = typeof this.port === "string" ? "Pipe " + this.port : "Port " + this.port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */
}

export default App;
