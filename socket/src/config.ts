export const ENVIRONMENT: "DEV" | "PROD" = "DEV";

export const PATH = "/v1";

export enum StatusCode {
  SUCCESS = "10000",
  FAILURE = "10001",
  RETRY = "10002",
  INVALID_ACCESS_TOKEN = "10003",
  INVALID_ENCRYPTED_INPUT = "10004",
}

export enum ResponseStatus {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

export enum ErrorType {
  BAD_TOKEN = "BadTokenError",
  TOKEN_EXPIRED = "TokenExpiredError",
  UNAUTHORIZED = "AuthFailureError",
  ACCESS_TOKEN = "AccessTokenError",
  INTERNAL = "InternalError",
  NOT_FOUND = "NotFoundError",
  NO_ENTRY = "NoEntryError",
  NO_DATA = "NoDataError",
  BAD_REQUEST = "BadRequestError",
  FORBIDDEN = "ForbiddenError",
  DB_ERROR = "DBError",
}

export enum ExternalApis {
  ACTIVITY_LOG = "http://localhost:4200/ezzify/api/v1/logs/activityLogs",
  ERROR_LOG = "http://localhost:4200/ezzify/api/v1/logs/errorActivityLogs",
}
