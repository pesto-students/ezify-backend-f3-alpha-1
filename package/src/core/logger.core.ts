import express from "express";
import axios from "axios";
import getmac from "getmac";

const moment = require("moment");

enum ExternalApis {
  ACTIVITY_LOG = "http://localhost:4200/ezzify/api/v1/logs/activityLogs",
  ERROR_LOG = "http://localhost:4200/ezzify/api/v1/logs/errorActivityLogs",
}

export class Logger {
  constructor(
    private response: express.Response,
    private request: express.Request,
    private statusCode: string,
    private status: number,
    private clientResponse: any
  ) {
    this._createLog();
  }

  private _createLog = async () => {
    // CREATING LOGS IN DATABASE
    const formatted_date = moment(new Date()).format("YYYY-MM-DD kk:mm:ss.SSS");
    const method = this.request.method;
    const url = this.request.protocol + "://" + this.request.get("host") + this.request.originalUrl;
    const status = this.statusCode;
    const duration = Date.now() - +this.response.get("start");

    
    if (this.status.toString().startsWith("2")) {
      const transactionsDetails = {
        body: this.request.body,
        query: this.request.query,
      };

      const activityLogDetails = {
        activityDateTime: formatted_date,
        deviceDetails: getmac(),
        method,
        endPoint: url,
        status: +status,
        statusCode: +this.status,
        responseTime: `${duration}ms`,
        transactionsDetails: JSON.stringify(transactionsDetails),
      };

      if (this.request.originalUrl !== "/ezzify/api/v1/logs/activityLogs" && this.request.originalUrl !== "/ezzify/api/v1/logs/errorActivityLogs") {
        // await this._insertLogInDB(activityLogDetails);
      }
    }

    if (!this.status.toString().startsWith("2")) {
      const transactionsDetails = {
        body: this.request.body,
        query: this.request.query,
      };

      const errorLogDetails = {
        activityDateTime: formatted_date,
        deviceDetails: getmac(),
        errorMethod: method,
        endPoint: url,
        errorCode: +status,
        statusCode: +this.status,
        responseTime: `${duration}ms`,
        errorDetails: this.clientResponse.message,
        transactionsDetails: JSON.stringify(transactionsDetails),
      };

      if (this.request.originalUrl !== "/ezzify/api/v1/logs/activityLogs" && this.request.originalUrl !== "/ezzify/api/v1/logs/errorActivityLogs") {
        // await this._insertErrorLogInDB(errorLogDetails);
      }
    }
  };

  private _insertLogInDB = (log: any) => {
    return new Promise((resolve, reject) => {
      axios
        .post(ExternalApis.ACTIVITY_LOG, log)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  private _insertErrorLogInDB = (log: any) => {
    return new Promise((resolve, reject) => {
      axios
        .post(ExternalApis.ERROR_LOG, log)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
}
