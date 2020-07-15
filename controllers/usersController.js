const usersController = (User) => {
  const getOne = (req, res) => {
    User.findById(req.params.id, (err, user) => {
      if (err) {
        res.status(404);
        return res.send('[HTTP_404_NOT_FOUND]');
      }

      res.send('[HTTP_200_OK]');
      res.status(200);
      return res.json(user);
    });
  };

  const getAll = (res) => {
    User.find({}, (err, users) => {
      res.send('[HTTP_200_OK]');
      res.status(200);
      return res.json(users);
    });
  };

  return { getOne, getAll };
};

module.exports = usersController;
