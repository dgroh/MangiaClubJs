const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const User = require('./models/userModel');
const userRouter = require('./routes/userRouter')(User);

app.use('/v1/api', userRouter);

app.server = app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Running on port ${port}`);
});

module.exports = app;