/**
 * Module dependencies.
 */
import * as express from 'express';
import * as compression from 'compression';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as errorHandler from 'errorhandler';
import * as lusca from 'lusca';
import * as dotenv from 'dotenv';
import * as mongo from 'connect-mongo';
import * as flash from 'express-flash';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import expressValidator = require('express-validator');
import * as bluebird from 'bluebird';
import * as HttpStatus from 'http-status-codes';
import { BaseController } from './controllers/base-controller';
import { SocketServer } from './controllers/socket';
import { SocketTypeEnum } from './models/socket-type-enum';
const cors = require('cors');
const MongoStore = mongo(session);
dotenv.config({ path: '.env' });

/**
 * Create Express server.
 */
const app = express();
export let cellFieldSocket: SocketServer;

const mongoUrl = process.env.MONGOLAB_URI;
(<any>mongoose).Promise = bluebird;

mongoose.connect(mongoUrl, {useMongoClient: true}).then(
  async () => {
    const db = mongoose.connection.db;
    defineRoutes();
    startSocketIO();
    startServer();
  }).catch(err => {
  console.log('MongoDB connection error. Please make sure MongoDB is running. ', err);
  process.exit();
});

/**
 * Express configuration.
 */
app.set('port', 3002);
/*app.set('views', path.join(__dirname, '../viewsB2c'));
app.set('view engine', 'pug');*/
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cors({origin: true}));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(cors({credentials: true, origin: true}));

/*app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use(express.static(path.join(__dirname, '../upload'), { maxAge: 31557600000 }));*/

function startSocketIO() {
  cellFieldSocket = new SocketServer(app, SocketTypeEnum.CELL_FIELD);
}

function defineRoutes() {

  const controllers: BaseController[] = [
    // new TilesController()
  ];

  console.log('--- Registering routes: ---');
  controllers.forEach((controller) => {
    console.log(`\t${controller.getPath()}`);
    app.route(controller.getPath()).post(controller.post.bind(controller));
    app.route(controller.getPath()).get(controller.get.bind(controller));
    app.route(controller.getPath()).put(controller.put.bind(controller));
    app.route(controller.getPath()).delete(controller.delete.bind(controller));
  });

  // Handle 404 error
  app.use((req, res, next) => {
    res.status(HttpStatus.NOT_FOUND);
    res.json({msg: '404'});
  });
}

function startServer() {
  /**
   * Error Handler. Provides full stack - remove for production
   */
  app.use(errorHandler());

  /**
   * Start Express server.
   */
  app.listen(app.get('port'), () => {
    console.log(('App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'));
    console.log('Press CTRL-C to stop\n');
  });
}
module.exports = app;
