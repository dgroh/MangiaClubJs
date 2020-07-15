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

  return { getOne, getAll };
};

module.exports = usersController;
