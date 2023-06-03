const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// load env var
dotenv.config({ path: './config/config.env' });

//connect DB
connectDB();

// route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const app = express();

//Body parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//File Uploading...
app.use(fileUpload());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));
// mount routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

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
