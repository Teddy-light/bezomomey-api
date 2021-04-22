const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const winston = require('winston');


// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

// Create the Express application
var app = express();

// Must first load the models
require('./core/models/user');

//hide sensitive info about our server to hackers
app.use(helmet());


//  body-parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Allows our react application to make HTTP requests to Express application
app.use(cors());


/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/app.js
app.use(require('./routes'));


app.get('/', (req, res) => {
    res.send('welcome home')
    });

    


/**
 * -------------- Logger ----------------
 */

function initializeLogger() {

   const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        defaultMeta: { service: 'user-service' },
        transports: [
          //
          // - Write all logs with level `error` and below to `error.log`
          // - Write all logs with level `info` and below to `combined.log`
          //
          new winston.transports.File({ filename: 'error.log', level: 'error' }),
          new winston.transports.File({ filename: 'combined.log' }),
        ],
      });
       
      //
      // If we're not in production then log to the `console` with the format:
      // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
      //
      if (process.env.NODE_ENV !== 'production') {
        logger.add(new winston.transports.Console({
          format: winston.format.simple(),
        }));
      }
} 


/**
 * -------------- SERVER ----------------
 */

function startServer() {
    initializeLogger();
    mongoose
        .connect(process.env.DB_STRING, {useNewUrlParser: true,  useUnifiedTopology: true})
        .then(db => {
            // logger.debug('db connected');
            console.log('db connected');
            app.listen(process.env.PORT, () => {
                // logger.debug(`app running on port ${process.env.PORT}`);
                console.log(`app running on port ${process.env.PORT}`);
            });
        })
        .catch(err => logger.error('error connecting to db', err));
}

startServer();
