process.env.NODE_ENV = "test";
const mongoose = require("mongoose");
const sinon = require("sinon");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../index");
const redis = require("../config/redis");

const { describe, it, beforeEach, afterEach } = require("mocha");
const expect = chai.expect;
chai.should();
chai.use(chaiHttp);

const constants = require("../config/constants");
const { routes, userMessages, errorMessages } = constants;
const userService = require("../services/user");

const FAKE_ID = "5bc34397665471414e51f";
const FAKE_PATH = "fgf";

describe("User Management User Controller", () => {
  let serviceStub;

  beforeEach((done) => {
    redis.flushdb(() => {
      done();
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("/POST Create Users", () => {
    it("it should create users", (done) => {
      const user = {
        email: "sisi@gmail.com",
        givenName: "sisi",
        familyName: "sisi",
      };

      const createdUser = {
        ...user,
        createdAt: new Date(),
        _id: new mongoose.Types.ObjectId(),
      };

      serviceStub = sinon.stub(userService, "createUser").resolves(createdUser);

      chai
        .request(server)
        .post(routes.users)
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.have.property("user");
          res.body.user.should.have.property("createdAt");
          res.body.user.should.have.property("email").to.equal(user.email);
          res.body.user.should.have
            .property("givenName")
            .to.equal(user.givenName);
          res.body.user.should.have
            .property("familyName")
            .to.equal(user.familyName);

          sinon.assert.calledOnce(serviceStub);
          done();
        });
    });

    it("it should not create users (validation error)", (done) => {
      const user = {
        email: "invalid-email",
        givenName: "si",
        familyName: "sisi",
      };

      serviceStub = sinon
        .stub(userService, "createUser")
        .throws({ status: 400, message: userMessages.invalidInput });

      chai
        .request(server)
        .post(routes.users)
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.have.property("message");
          res.body.should.have
            .property("message")
            .to.equal(userMessages.invalidInput);

          sinon.assert.calledOnce(serviceStub);
          done();
        });
    });
  });

  describe("/GET All Users", () => {
    it("it should return all users", (done) => {
      const users = [
        {
          email: "fifi@gmail.com",
          givenName: "fifi",
          familyName: "fifi",
          createdAt: new Date(),
          _id: new mongoose.Types.ObjectId(),
        },
      ];

      serviceStub = sinon.stub(userService, "getAllUsers").resolves(users);

      chai
        .request(server)
        .get(routes.users)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.property("users");
          expect(res.body.users).to.be.an("array");
          res.body.users.should.have.length.greaterThan(0);

          sinon.assert.calledOnce(serviceStub);
          done();
        });
    });

    it("it should return error when fetching users", (done) => {
      serviceStub = sinon
        .stub(userService, "getAllUsers")
        .throws(new Error(userMessages.getAllUsersError));

      chai
        .request(server)
        .get(`${routes.users}?invalidParam=true`)
        .end((err, res) => {
          res.should.have.status(404);
          expect(res).to.be.json;
          expect(res.body).to.have.property("message");
          res.body.should.have
            .property("message")
            .to.equal(userMessages.getAllUsersError);

          sinon.assert.calledOnce(serviceStub);
          done();
        });
    });
  });

  describe("/GET User By ID", () => {
    it("it should return user based on ID", (done) => {
      const user = {
        email: "fifi@gmail.com",
        givenName: "fifi",
        familyName: "fifi",
        createdAt: new Date(),
        _id: new mongoose.Types.ObjectId(),
      };

      serviceStub = sinon.stub(userService, "getUser").resolves(user);

      chai
        .request(server)
        .get(`${routes.users}/${user._id}`)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.property("user");
          res.body.user.should.have.property("createdAt");
          res.body.user.should.have.property("email").to.equal(user.email);
          res.body.user.should.have
            .property("givenName")
            .to.equal(user.givenName);
          res.body.user.should.have
            .property("familyName")
            .to.equal(user.familyName);

          sinon.assert.calledOnce(serviceStub);
          done();
        });
    });
  });

  describe("/PUT User By ID", () => {
    it("it should update user based on ID", (done) => {
      const user = {
        email: "gigi@gmail.com",
        givenName: "gigi",
        familyName: "gigi",
      };
      const updateEmail = "wiwi@gmail.com";

      const updatedUser = {
        ...user,
        email: updateEmail,
        createdAt: new Date(),
        _id: new mongoose.Types.ObjectId(),
      };

      serviceStub = sinon.stub(userService, "updateUser").resolves(updatedUser);

      chai
        .request(server)
        .put(`${routes.users}/${updatedUser._id}`)
        .send({ email: updateEmail })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.property("user");
          res.body.user.should.have.property("email").to.equal(updateEmail);

          sinon.assert.calledOnce(serviceStub);
          done();
        });
    });
  });

  describe("/DELETE User By ID", () => {
    it("it should delete user based on ID", (done) => {
      const user = {
        email: "gigi@gmail.com",
        givenName: "gigi",
        familyName: "gigi",
        createdAt: new Date(),
        _id: new mongoose.Types.ObjectId(),
      };

      serviceStub = sinon.stub(userService, "deleteUser").resolves(user);

      chai
        .request(server)
        .delete(`${routes.users}/${user._id}`)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.property("message");
          res.body.should.have
            .property("message")
            .to.equal("User deleted successfully");

          sinon.assert.calledOnce(serviceStub);
          done();
        });
    });
  });
});
