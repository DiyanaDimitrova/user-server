process.env.NODE_ENV = "test";

let mongoose = require("mongoose");
let User = require("../models/User");

let mocha = require("mocha");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../index");
let describe = mocha.describe;
let it = mocha.it;
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

describe("User Controller", () => {
  before(done => {
    User.remove({}, err => {
      console.log(err);
      done();
    });
  });

  describe("/POST Create Users", () => {
    it("it should create users", done => {
      const user = {
        email: "sisi@gmail.com",
        givenName: "sisi",
        familyName: "sisi"
      };

      chai
        .request(server)
        .post("/user")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res).to.be.json;
          expect(res.body)
            .to.have.property("message")
            .to.equal("User is created successfully!");
          done();
        });
    });
    it("it should not create users", done => {
      const user = {
        email: "sisi@gmail.com",
        givenName: "si",
        familyName: "sisi"
      };

      chai
        .request(server)
        .post("/user")
        .send(user)
        .end((err, res) => {
          res.should.have.status(500);
          expect(res).to.be.json;
          expect(res.body)
            .to.have.property("message")
            .to.equal("User could not be created!");
          done();
        });
    });
  });

  describe("/GET All Users", () => {
    it("it should return all users", done => {
      let user = new User({
        email: "didi@gmail.com",
        givenName: "didi",
        familyName: "didi"
      });

      User.create(user).then(user => {
        chai
          .request(server)
          .get("/user")
          .end((err, res) => {
            res.should.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.have.property("users");
            done();
          });
      });
    });
    it("it should not return all users", done => {
      chai
        .request(server)
        .get("/user?email=bnb")
        .end((err, res) => {
          res.should.have.status(500);
          expect(res).to.be.json;
          expect(res.body)
            .to.have.property("message")
            .to.equal("All users could not be loaded!");
          done();
        });
    });
  });

  describe("/GET User By ID", () => {
    it("it should return user based on ID", done => {
      let user = new User({
        email: "fifi@gmail.com",
        givenName: "fifi",
        familyName: "fifi"
      });

      User.create(user).then(user => {
        chai
          .request(server)
          .get("/user/" + user.id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("user");
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
        .get("/user/5bc34397665471414e51f")
        .end((err, res) => {
          res.should.have.status(500);
          expect(res).to.be.json;
          expect(res.body)
            .to.have.property("message")
            .to.equal("User could not be loaded!");
          done();
        });
    });
  });

  describe("/PUT User By ID", () => {
    it("it should update user based on ID", done => {
      let user = new User({
        email: "gigi@gmail.com",
        givenName: "gigi",
        familyName: "gigi"
      });

      User.create(user).then(user => {
        chai
          .request(server)
          .put("/user/" + user.id)
          .send({ email: "wiwi@gmail.com" })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("user");
            res.body.user.should.have
              .property("email")
              .to.equal("wiwi@gmail.com");
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
      chai
        .request(server)
        .put("/user/5bc34397665471414e51f")
        .send({ email: "didi@gmail.com" })
        .end((err, res) => {
          res.should.have.status(500);
          expect(res).to.be.json;
          expect(res.body)
            .to.have.property("message")
            .to.equal("User could not be updated!");
          done();
        });
    });
  });

  describe("/DELETE User By ID", () => {
    it("it should delete user based on ID", done => {
      let user = new User({
        email: "kiki@gmail.com",
        givenName: "kiki",
        familyName: "kiki"
      });

      User.create(user).then(user => {
        chai
          .request(server)
          .delete("/user/" + user.id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("user");
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
        .delete("/user/5bc34397665471414e51f")
        .end((err, res) => {
          res.should.have.status(500);
          expect(res).to.be.json;
          expect(res.body)
            .to.have.property("message")
            .to.equal("User could not be deleted!");
          done();
        });
    });
  });

  describe("/NOT FOUND ", () => {
    it("it should get 404 status Not Found", done => {
      chai
        .request(server)
        .get("/userfgf")
        .end((err, res) => {
          res.should.have.status(404);
          res.should.have.property("text").to.equal("Not Found");
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
