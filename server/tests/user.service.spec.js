process.env.NODE_ENV = "test";
const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;

const redis = require("../config/redis");
const { User } = require("../models/User");
// const { UserDTO } = require("../models/UserDTO");
const validator = require("../utils/validator");

const UserService = require("../services/user");
const { userMessages, errorMessages } = require("../config/constants");

describe("User Service", () => {
  let redisGetStub, redisSetStub, redisDelStub;
  let findStub,
    findByIdStub,
    createStub,
    findByIdAndUpdateStub,
    findByIdAndDeleteStub;
  // let findAllStub, findByPkStub, createDTOStub, updateDTOStub, destroyDTOStub;
  let validatorStub;

  beforeEach(() => {
    redisGetStub = sinon.stub(redis, "get");
    redisSetStub = sinon.stub(redis, "set");
    redisDelStub = sinon.stub(redis, "del");

    findStub = sinon.stub(User, "find");
    findByIdStub = sinon.stub(User, "findById");
    createStub = sinon.stub(User, "create");
    findByIdAndUpdateStub = sinon.stub(User, "findByIdAndUpdate");
    findByIdAndDeleteStub = sinon.stub(User, "findByIdAndDelete");

    // findAllStub = sinon.stub(UserDTO, "findAll");
    // findByPkStub = sinon.stub(UserDTO, "findByPk");
    // createDTOStub = sinon.stub(UserDTO, "create");
    // updateDTOStub = sinon.stub(UserDTO, "update");
    // destroyDTOStub = sinon.stub(UserDTO, "destroy");

    validatorStub = sinon.stub(validator, "isValidName").returns(true);
    sinon.stub(validator, "isValidEmail").returns(true);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getAllUsers", () => {
    it("should return cached users", async () => {
      redisGetStub
        .withArgs("users")
        .resolves(JSON.stringify([{ email: "test@example.com" }]));
      const users = await UserService.getAllUsers({});
      expect(users).to.be.an("array");
      expect(users[0].email).to.equal("test@example.com");
    });

    it("should return users from database and cache them", async () => {
      redisGetStub.resolves(null);
      findStub.resolves([{ email: "test@example.com" }]);
      const users = await UserService.getAllUsers({});
      expect(users).to.be.an("array");
      expect(redisSetStub.calledWith("users")).to.be.true;
    });

    it("should throw an error if no users found", async () => {
      redisGetStub.resolves(null);
      findStub.resolves([]);
      try {
        await UserService.getAllUsers({});
      } catch (error) {
        expect(error.message).to.equal(userMessages.noUser);
      }
    });
  });

  describe("getUser", () => {
    it("should return cached user by ID", async () => {
      redisGetStub.resolves(JSON.stringify({ email: "test@example.com" }));
      const user = await UserService.getUser("123");
      expect(user).to.be.an("object");
      expect(user.email).to.equal("test@example.com");
    });

    it("should return user from database and cache it", async () => {
      redisGetStub.resolves(null);
      findByIdStub.resolves({ email: "test@example.com" });
      const user = await UserService.getUser("123");
      expect(user).to.be.an("object");
      expect(redisSetStub.called).to.be.true;
    });

    it("should throw an error if user not found", async () => {
      redisGetStub.resolves(null);
      findByIdStub.resolves(null);
      try {
        await UserService.getUser("123");
      } catch (error) {
        expect(error.message).to.equal(userMessages.getUserError);
      }
    });
  });

  describe("createUser", () => {
    it("should create a user and clear cache", async () => {
      createStub.resolves({ email: "test@example.com" });
      const user = await UserService.createUser({ email: "test@example.com" });
      expect(user.email).to.equal("test@example.com");
      expect(redisDelStub.calledWith("users")).to.be.true;
    });

    it("should throw an error for invalid input", async () => {
      validatorStub.returns(false);
      try {
        await UserService.createUser({ email: "invalid" });
      } catch (error) {
        expect(error.message).to.equal(userMessages.invalidInput);
      }
    });
  });

  describe("updateUser", () => {
    it("should update a user and clear cache", async () => {
      findByIdAndUpdateStub.resolves({ email: "updated@example.com" });
      const user = await UserService.updateUser("123", {
        email: "updated@example.com",
      });
      expect(user.email).to.equal("updated@example.com");
      expect(redisDelStub.called).to.be.true;
    });

    it("should throw an error if user not found for update", async () => {
      findByIdAndUpdateStub.resolves(null);
      try {
        await UserService.updateUser("123", {
          email: "nonexistent@example.com",
        });
      } catch (error) {
        expect(error.message).to.equal(userMessages.updateUserError);
      }
    });
  });

  describe("deleteUser", () => {
    it("should delete a user and clear cache", async () => {
      findByIdAndDeleteStub.resolves({ email: "deleted@example.com" });
      const user = await UserService.deleteUser("123");
      expect(user.email).to.equal("deleted@example.com");
      expect(redisDelStub.called).to.be.true;
    });

    it("should throw an error if user not found for deletion", async () => {
      findByIdAndDeleteStub.resolves(null);
      try {
        await UserService.deleteUser("123");
      } catch (error) {
        expect(error.message).to.equal(userMessages.deleteUserError);
      }
    });
  });
});
