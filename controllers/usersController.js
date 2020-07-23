const usersController = (User) => {
  const getOne = (req, res) => {
    User.findById(req.params.id, (err, user) => {
      if (err) {
        res.status(404);
        res.send('[HTTP_404_NOT_FOUND]');
        return err;
      }

      res.status(200);
      res.json(user);

      return;
    });
  };

  const getAll = (req, res) => {
    User.find({}, (err, users) => {
      if (err) {
        res.status(500);
        res.send('[HTTP_500_INTERNAL_SERVER_ERROR]');
        return err;
      }

      res.status(200);
      res.json(users);

      return;
    });
  };

  const create = (req, res) => {
    if (_userExists(req.body.email)) {
      res.status(409);
      res.send('[HTTP_409_CONFLICT]');
      return res;
    }

    User.create(req.body, (err, user) => {
      if (err) {
        res.status(500);
        res.send('[HTTP_500_INTERNAL_SERVER_ERROR]');
        return err;
      }

      res.status(201);
      res.json(user);

      return;
    });
  };

  const _userExists = (email) => {
    return User.find({ email }, function (err, user) {
      if (user) {
        return true;
      };

      return false;
    });
  }

  return { getOne, getAll, create };
};

module.exports = usersController;
