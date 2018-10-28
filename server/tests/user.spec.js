process.env.NODE_ENV = "test";
const mongoose = require("mongoose");
const User = require("../models/User");
const constants = require("../config/constants");
const mocha = require("mocha");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../index");
const describe = mocha.describe;
const it = mocha.it;
const should = chai.should();
const expect = chai.expect;
const {
  users,
  getAllUsersError,
  getCreateUserSuccess,
  getCreateUserError,
  getUserError,
  updateUserSuccess,
  updateUserError,
  deleteUserSuccess,
  deleteUserError,
  invalidInput,
  noUser,
  notFound
} = constants;
chai.use(chaiHttp);

const FAKE_ID = "5bc34397665471414e51f";
const FAKE_QUERY_PARAM = "email=bnb";
const FAKE_PATH = "fgf";

describe("User Management User Controller", () => {
  before(done => {
    User.remove({}, err => {
      if (err) console.log(err);
      done();
    });
  });

  describe("/POST Create Users", () => {
    it("it should create users", done => {
      const user = new User({
        email: "sisi@gmail.com",
        givenName: "sisi",
        familyName: "sisi"
      });

      chai
        .request(server)
        .post(users)
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.property("message");
          res.body.should.have
            .property("message")
            .to.equal(getCreateUserSuccess);
          expect(res.body).to.have.property("user");
          res.body.user.should.have.property("created");
          res.body.user.should.have.property("email").to.equal(user.email);
          res.body.user.should.have
            .property("givenName")
            .to.equal(user.givenName);
          res.body.user.should.have
            .property("familyName")
            .to.equal(user.familyName);
          done();
        });
    });
    it("it should not create users", done => {
      const user = new User({
        email: "sisi@gmail.com",
        givenName: "si",
        familyName: "sisi"
      });

      chai
        .request(server)
        .post(users)
        .send(user)
        .end((err, res) => {
          res.should.have.status(500);
          expect(res).to.be.json;
          expect(res.body).to.have.property("message");
          res.body.should.have.property("message").to.equal(getCreateUserError);
          done();
        });
    });
  });

  describe("/GET All Users", () => {
    it("it should return all users", done => {
      chai
        .request(server)
        .get(users)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.property("users");
          expect(res.body.users).to.be.an("array");
          res.body.users.should.have.length.greaterThan(0);
          done();
        });
    });
    it("it should not return all users", done => {
      chai
        .request(server)
        .get(`${users}?${FAKE_QUERY_PARAM}`)
        .end((err, res) => {
          res.should.have.status(500);
          expect(res).to.be.json;
          expect(res.body).to.have.property("message");
          res.body.should.have.property("message").to.equal(getAllUsersError);
          done();
        });
    });
  });

  describe("/GET User By ID", () => {
    it("it should return user based on ID", done => {
      const user = new User({
        email: "fifi@gmail.com",
        givenName: "fifi",
        familyName: "fifi"
      });

      User.create(user).then(user => {
        chai
          .request(server)
          .get(`${users}/${user.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.have.property("user");
            res.body.user.should.have.property("created");
            res.body.user.should.have.property("email").to.equal(user.email);
            res.body.user.should.have
              .property("givenName")
              .to.equal(user.givenName);
            res.body.user.should.have
              .property("familyName")
              .to.equal(user.familyName);
            done();
          });
      });
    });
    it("it should not return user based on ID", done => {
      chai
        .request(server)
        .get(`${users}/${FAKE_ID}`)
        .end((err, res) => {
          res.should.have.status(500);
          expect(res).to.be.json;
          expect(res.body).to.have.property("message");
          res.body.should.have.property("message").to.equal(getUserError);
          done();
        });
    });
  });

  describe("/PUT User By ID", () => {
    it("it should update user based on ID", done => {
      const user = new User({
        email: "gigi@gmail.com",
        givenName: "gigi",
        familyName: "gigi"
      });
      const updateEmail = "wiwi@gmail.com";

      User.create(user).then(user => {
        chai
          .request(server)
          .put(`${users}/${user.id}`)
          .send({ email: updateEmail })
          .end((err, res) => {
            res.should.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.have.property("message");
            res.body.should.have
              .property("message")
              .to.equal(updateUserSuccess);
            expect(res.body).to.have.property("user");
            res.body.user.should.have.property("created");
            res.body.user.should.have.property("email").to.equal(updateEmail);
            res.body.user.should.have
              .property("givenName")
              .to.equal(user.givenName);
            res.body.user.should.have
              .property("familyName")
              .to.equal(user.givenName);
            done();
          });
      });
    });
    it("it should not update user based on ID", done => {
      const email = "didi@gmail.com";
      chai
        .request(server)
        .put(`${users}/${FAKE_ID}`)
        .send({ ...email })
        .end((err, res) => {
          res.should.have.status(500);
          expect(res).to.be.json;
          expect(res.body).to.have.property("message");
          res.body.should.have.property("message").to.equal(updateUserError);
          done();
        });
    });
  });

  describe("/DELETE User By ID", () => {
    it("it should delete user based on ID", done => {
      const user = new User({
        email: "kiki@gmail.com",
        givenName: "kiki",
        familyName: "kiki"
      });

      User.create(user).then(user => {
        chai
          .request(server)
          .delete(`${users}/${user.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.have.property("message");
            res.body.should.have
              .property("message")
              .to.equal(deleteUserSuccess);
            expect(res.body).to.have.property("user");
            res.body.user.should.have.property("created");
            res.body.user.should.have.property("email").to.equal(user.email);
            res.body.user.should.have
              .property("givenName")
              .to.equal(user.givenName);
            res.body.user.should.have
              .property("familyName")
              .to.equal(user.givenName);
            done();
          });
      });
    });
    it("it should not delete user based on ID", done => {
      chai
        .request(server)
        .delete(`${users}/${FAKE_ID}`)
        .end((err, res) => {
          res.should.have.status(500);
          expect(res).to.be.json;
          expect(res.body).to.have.property("message");
          res.body.should.have.property("message").to.equal(deleteUserError);
          done();
        });
    });
  });

  describe("/NOT FOUND ", () => {
    it("it should get 404 status Not Found", done => {
      chai
        .request(server)
        .get(`${users}${FAKE_PATH}`)
        .end((err, res) => {
          res.should.have.status(404);
          expect(res).to.have.property("text");
          res.should.have.property("text").to.equal(notFound);
          done();
        });
    });
  });
  after(done => {
    User.remove({}, err => {
      if (err) console.log(err);
      done();
    });
  });
});
