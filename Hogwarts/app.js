const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const newsRoutes = require('./routes/news');
const housesRoutes = require('./routes/houses');
const quidditchRoutes = require('./routes/quidditch');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/news', newsRoutes);
app.use('/houses', housesRoutes);
app.use('/quidditch', quidditchRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    'mongodb+srv://boo:123@cluster0-gtms9.mongodb.net/hogwarts?retryWrites=true&w=majority'
  )
  .then((res) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
