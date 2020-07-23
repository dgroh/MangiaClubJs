const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/userModel');
const userRouter = require('./routes/userRouter')(User);

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/v1/api', userRouter);

app.server = app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Running on port ${port}`);
});

module.exports = app;