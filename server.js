const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// load env var
dotenv.config({ path: './config/config.env' });

//connect DB
connectDB();

// route files
const bootcamps = require('./routes/bootcamps');

const app = express();

//Body parser
app.use(express.json());

// dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// mount routes
app.use('/api/v1/bootcamps', bootcamps);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);

// handle Unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error : ${err.message}`);

  // Close server and exit process
  server.close(() => process.exit(1));
});
