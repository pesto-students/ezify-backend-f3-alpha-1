import "dotenv/config";

import chai from "chai";
import chaiHttp from "chai-http";

import { PATH } from "./../../src/config";

const { PORT } = process.env;

chai.should();
chai.use(chaiHttp);

describe("Security", () => {
  describe("POST /security/encryption", () => {
    it("It should encrypt the data", (done) => {
      const postObj = {
        name: "Harshit",
        age: 22,
      };

      chai
        .request(`http://localhost:${PORT}`)
        .post(`${PATH}/security/encryption`)
        .send(postObj)
        .end((err, response) => {
          response.body.should.have.property("message").to.equal("data encrypted");
          done();
        });
    });
  });

  describe("POST /security/decryption", () => {
    it("It should decrypt the data", (done) => {
      const postObj = {
        data: "U2FsdGVkX18vjzkxdQXCy/Vb6OK5a4fHyiSv6BTfMVNjrbsUx/rWJiLf6+MBZYcu",
      };

      chai
        .request(`http://localhost:${PORT}`)
        .post(`${PATH}/security/decryption`)
        .send(postObj)
        .end((err, response) => {
          response.body.should.have.property("message").to.equal("data decrypted");
          done();
        });
    });
  });
});
