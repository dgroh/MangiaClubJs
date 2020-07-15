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
  });

  afterEach(() => {
    User.find.restore();
    User.findOne.restore();
  });

  after((done) => {
    app.server.close(done);
  });

  describe('Get /', () => {
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

      it('responds with 500 when an internal error occurs', function (done) {
        User.find.yields({}, null);

        request(app)
          .get(`/v1/api/users/`)
          .set('Accept', 'text/plain')
          .expect('Content-Type', /text/)
          .expect(500, '[HTTP_500_INTERNAL_SERVER_ERROR]')
          .end(function(err, res) {
            done(err);
          });
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
          .expect(404, '[HTTP_404_NOT_FOUND]')
          .end(function(err, res) {
            done(err);
          });
      });
    });
  })
});