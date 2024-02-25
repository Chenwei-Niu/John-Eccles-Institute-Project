// server.js
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const emailRoutes = require('./routes/emailRoutes');
const presenterRoutes = require('./routes/presenterRoutes');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/email', emailRoutes);
app.use('/presenter',presenterRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
