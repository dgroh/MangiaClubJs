const express = require('express');
const usersController = require('../controllers/usersController');

const routes = (User) => {
  const userRouter = express.Router();

  const controller = usersController(User);

  userRouter.route('/users')
    .get(controller.getAll)
    .post(controller.create);

  userRouter.route('/users/:id')
    .get(controller.getOne);

  return userRouter;
};

module.exports = routes;
