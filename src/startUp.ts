import 'reflect-metadata';
import 'dotenv/config';
import express, {Request, Response, NextFunction} from 'express';
import 'express-async-errors';
import { json, urlencoded } from 'body-parser';
import { AppLogger } from './util/appLogger';
import compression from 'compression';
import * as cors from 'cors';
import loginRouter from './routes/login-router';
import publicRouter from './routes/public-router';
import Auth from './firebase-auth';
import AppError from './shared/errors/AppError';
import Database from './util/db';
import apostaRouter from './routes/aposta-router';


class StartUp {
  public app: express.Application;
  private _db: Database;
  auth = new Auth()

  constructor() {
    this.app = express();
    this._db = new Database();
    this._db.createConnection();
    this.configureMiddleware();
    this.routes();
    this.app.use((error: Error, request: Request, response: Response, next: NextFunction)=>{
      if(error instanceof AppError){
        return response.status(error.statusCode).json({
          status: 'error',
          message: error.message
        })
      }
      return response.status(500).json({
        status: 'error',
        message: 'Internal server error'
      })
    });

  }

  routes() {
    this.app.use("/api", loginRouter);
    this.app.use("/api/public", publicRouter);
 //   this.app.use(this.auth.validate);
    this.app.use("/api/apostas", apostaRouter);
  }

  private configureMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(json({ limit: '50mb' }));
    this.app.use(compression());
    this.app.use(urlencoded({ limit: '50mb', extended: true }));
    this.enableCors();
    AppLogger.configureLogger();
  }

  enableCors() {
    const options: cors.CorsOptions = {
      methods: "GET,OPTIONS,PUT,POST,DELETE",
      origin: "*",
    }
    this.app.use(cors.default(options));
  }

}

export default new StartUp();
