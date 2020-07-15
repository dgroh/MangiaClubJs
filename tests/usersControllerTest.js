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
      phone: '+4915162961189',
      published: true,
      created_datetime: new Date().toUTCString(),
    });

    const boo = new User({
      email: 'boo@boo.com',
      first_name: 'boo',
      last_name: 'boo',
      hashed_password: 'hashed_password',
      password_salt: 'salt',
      phone: '+4915162961189',
      published: true,
      created_datetime: new Date().toUTCString(),
    });

    return [foo, boo];
  };

  describe('Get', () => {
    const existingUserId = 1;
    const nonExistingUserId = -1;

    let findByIdStub; let
      findStub;

    beforeEach(() => {
      findByIdStub = sinon.stub(User, 'findById');
      findStub = sinon.stub(User, 'find');
    });

    afterEach(() => {
      findByIdStub.restore();
      findStub.restore();
    });

    it('should get user when user exists', () => {
      // Arrange
      const req = { params: { id: existingUserId } };
      const res = { status: sinon.spy(), send: sinon.spy(), json: sinon.spy() };
      const expectedUser = users()[0];

      findByIdStub.yields(null, expectedUser);

      const controller = usersController(User);

      // Act
      controller.getOne(req, res);

      // Assert
      res.status.calledWith(200).should.true();
      res.send.calledWith('[HTTP_200_OK]').should.true();
      res.json.calledWith(expectedUser).should.true();
    });

    it('should return http code 404 when user does not exist', () => {
      // Arrange
      const req = { params: { id: nonExistingUserId } };
      const res = { status: sinon.spy(), send: sinon.spy() };
      const err = {};

      findByIdStub.yields(err, null);

      const controller = usersController(User);

      // Act
      controller.getOne(req, res);

      // Assert
      res.status.calledWith(404).should.true();
      res.send.calledWith('[HTTP_404_NOT_FOUND]').should.true();
    });

    it('should get all users', () => {
      // Arrange
      const res = { status: sinon.spy(), json: sinon.spy(), send: sinon.spy() };
      const expectedUsers = users();

      findStub.yields(null, expectedUsers);

      const controller = usersController(User);

      // Act
      controller.getAll(res);

      // Assert
      res.status.calledWith(200).should.true();
      res.send.calledWith('[HTTP_200_OK]').should.true();
      res.json.calledWith(expectedUsers).should.true();
    });
  });
});
