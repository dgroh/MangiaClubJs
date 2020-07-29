const app = require('../app.js');
const request = require('supertest');
const sinon = require('sinon');
const User = require('../models/userModel');

describe('userRouter', function () {
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

  beforeEach(() => {
    sinon.stub(User, 'find');
    sinon.stub(User, 'findOne');
    sinon.stub(User, 'create');
    sinon.stub(User, 'findByIdAndDelete');
  });

  afterEach(() => {
    User.find.restore();
    User.findOne.restore();
    User.create.restore();
    User.findByIdAndDelete.restore();
  });

  after((done) => {
    app.server.close(done);
  });

  describe('GET /', () => {
    describe('/v1/api/users', () => {
      it('responds with 200', function (done) {
        const expectedUsers = users();

        User.find.yields(null, expectedUsers);

        request(app)
          .get('/v1/api/users')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200, JSON.stringify(expectedUsers), done)
      });

      it('responds with 500 when an internal server error occurs', function (done) {
        User.find.yields({}, null);

        request(app)
          .get(`/v1/api/users/`)
          .set('Accept', 'text/plain')
          .expect('Content-Type', /text/)
          .expect(500, '[HTTP_500_INTERNAL_SERVER_ERROR]', done);
      });
    });

    describe('/v1/api/users/:id', () => {
      it('responds with 200 when user exists', function (done) {
        const expectedUser = users()[0];

        User.findOne.yields(null, expectedUser);

        request(app)
          .get(`/v1/api/users/${expectedUser._id}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200, JSON.stringify(expectedUser), done);
      });

      it('responds with 404 when user does not exists', function (done) {
        User.findOne.yields({}, null);

        request(app)
          .get(`/v1/api/users/-1`)
          .set('Accept', 'text/plain')
          .expect('Content-Type', /text/)
          .expect(404, '[HTTP_404_NOT_FOUND]', done);
      });
    });
  })

  describe('POST /', () => {
    describe('/v1/api/users', () => {
      it('responds with 200', function (done) {
        // Arrange
        const newUser = new User({
          email: 'boo2@boo.com',
          first_name: 'boo2',
          last_name: 'boo2',
          hashed_password: 'hashed_password',
          password_salt: 'salt',
          phone: '+49151',
          published: true,
          created_datetime: new Date().toUTCString()
        });

        User.create.yields(null, newUser);

        request(app)
          .post('/v1/api/users')
          .send(newUser)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(201, JSON.stringify(newUser), done);
      });

      it('responds with 500 when an internal server error occurs', function (done) {
        // Arrange
        User.create.yields({}, null);

        request(app)
          .post('/v1/api/users')
          .send({})
          .set('Accept', 'text/plain')
          .expect('Content-Type', /text/)
          .expect(500, '[HTTP_500_INTERNAL_SERVER_ERROR]', done);
      });

      it('responds with 409 when user already exists', function (done) {
        // Arrange
        const duplicattedUser = users()[0];

        User.find.yields(null, duplicattedUser);

        request(app)
          .post('/v1/api/users')
          .send(duplicattedUser)
          .set('Accept', 'text/plain')
          .expect('Content-Type', /text/)
          .expect(409, '[HTTP_409_CONFLICT]', done);
      });
    });
  })

  describe('DELETE /', () => {
    describe('/v1/api/users/:id', () => {
      it('responds with 204 when user is deleted', function (done) {
        const userToDelete = users()[0];

        User.findByIdAndDelete.yields(null, userToDelete);

        request(app)
          .delete(`/v1/api/users/${userToDelete._id}`)
          .expect(204, done);
      });

      it('responds with 404 when user to be deleted does not exist', function (done) {
        User.findByIdAndDelete.yields({}, null);

        request(app)
          .delete(`/v1/api/users/-1`)
          .set('Accept', 'text/plain')
          .expect('Content-Type', /text/)
          .expect(404, '[HTTP_404_NOT_FOUND]', done);
      });
    });
  })
});