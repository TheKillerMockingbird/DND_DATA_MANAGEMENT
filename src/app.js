const express = require('express');
const morgan = require('morgan');

const campaignRoutes = require('./routes/campaignRoutes');
const characterRoutes = require('./routes/characterRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    message: 'D&D Campaign Manager API is running'
  });
});

app.use('/campaigns', campaignRoutes);
app.use('/characters', characterRoutes);
app.use('/sessions', sessionRoutes);

app.use('/auth', authRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;