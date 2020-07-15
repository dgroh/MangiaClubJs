// eslint-disable-next-line
const should = require('should');
const sinon = require('sinon');
const User = require('../models/userModel');
const usersController = require('../controllers/usersController');

describe('usersController', () => {
  const users = () => {
    const foo = new User({
      email: 'foo@foo.com',
      first_name: 'foo',
      last_name: 'foo',
      hashed_password: 'hashed_password',
      password_salt: 'salt',
      phone: '+49151',
      published: true,
      created_datetime: new Date().toUTCString(),
    });

    const boo = new User({
      email: 'boo@boo.com',
      first_name: 'boo',
      last_name: 'boo',
      hashed_password: 'hashed_password',
      password_salt: 'salt',
      phone: '+49151',
      published: true,
      created_datetime: new Date().toUTCString(),
    });

    return [foo, boo];
  };

  const existingUserId = 1;
  const nonExistingUserId = -1;

  beforeEach(() => {
    sinon.stub(User, 'findById');
    sinon.stub(User, 'find');
  });

  afterEach(() => {
    User.findById.restore();
    User.find.restore();
  });

  describe('getOne', () => {
    it('returns user when user exists', () => {
      // Arrange
      const req = { params: { id: existingUserId } };
      const res = { status: sinon.spy(), send: sinon.spy(), json: sinon.spy() };
      const expectedUser = users()[0];

      User.findById.yields(null, expectedUser);

      const controller = usersController(User);

      // Act
      controller.getOne(req, res);

      // Assert
      res.status.calledWith(200).should.true();
      res.json.calledWith(expectedUser).should.true();
      res.send.notCalled.should.true();
    });

    it('returns 404 when user does not exist', () => {
      // Arrange
      const req = { params: { id: nonExistingUserId } };
      const res = { status: sinon.spy(), json: sinon.spy(), send: sinon.spy() };
      const err = {};

      User.findById.yields(err, null);

      const controller = usersController(User);

      // Act
      controller.getOne(req, res);

      // Assert
      res.status.calledWith(404).should.true();
      res.send.calledWith('[HTTP_404_NOT_FOUND]').should.true();
      res.json.notCalled.should.true();
    });
  });

  describe('getAll', () => {
    it('returns all users', () => {
      // Arrange
      const req = {};
      const res = { status: sinon.spy(), json: sinon.spy(), send: sinon.spy() };
      const expectedUsers = users();

      User.find.yields(null, expectedUsers);

      const controller = usersController(User);

      // Act
      controller.getAll(req, res);

      // Assert
      res.status.calledWith(200).should.true();
      res.json.calledWith(expectedUsers).should.true();
      res.send.notCalled.should.true();
    });
  });
});
