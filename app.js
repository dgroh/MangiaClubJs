const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Welcome to Mangia Club in Node WIP!');
});

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Running on port ${port}`);
});
