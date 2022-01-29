"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var chai_1 = __importDefault(require("chai"));
var chai_http_1 = __importDefault(require("chai-http"));
var config_1 = require("./../../src/config");
var PORT = process.env.PORT;
chai_1.default.should();
chai_1.default.use(chai_http_1.default);
describe("Security", function () {
    describe("POST /security/encryption", function () {
        it("It should encrypt the data", function (done) {
            var postObj = {
                name: "Harshit",
                age: 22,
            };
            chai_1.default
                .request("http://localhost:".concat(PORT))
                .post("".concat(config_1.PATH, "/security/encryption"))
                .send(postObj)
                .end(function (err, response) {
                response.body.should.have.property("message").to.equal("data encrypted");
                done();
            });
        });
    });
    describe("POST /security/decryption", function () {
        it("It should decrypt the data", function (done) {
            var postObj = {
                data: "U2FsdGVkX18vjzkxdQXCy/Vb6OK5a4fHyiSv6BTfMVNjrbsUx/rWJiLf6+MBZYcu",
            };
            chai_1.default
                .request("http://localhost:".concat(PORT))
                .post("".concat(config_1.PATH, "/security/decryption"))
                .send(postObj)
                .end(function (err, response) {
                response.body.should.have.property("message").to.equal("data decrypted");
                done();
            });
        });
    });
});
