const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');

const newsRoutes = require('./routes/news');
const housesRoutes = require('./routes/houses');
const quidditchRoutes = require('./routes/quidditch');
const authRoutes = require('./routes/auth');
const teachersRoutes = require('./routes/teachers');

const app = express();

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

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
app.use('/auth', authRoutes);
app.use('/teachers', teachersRoutes);

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
