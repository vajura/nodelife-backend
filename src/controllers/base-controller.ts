import { NextFunction, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';

export abstract class BaseController {

  static POST: string = 'POST';
  static GET: string = 'GET';
  static PUT: string = 'PUT';
  static DELETE: string = 'DELETE';

  /**
   * Path for the route controller eg. '/offers'.
   * @returns {string}
   */
  abstract getPath(): string;

  async post(req: Request, res: Response, next: NextFunction): Promise<any> {
    return res
      .status(HttpStatus.NOT_IMPLEMENTED)
      .json({});
  }

  async get(req: Request, res: Response, next: NextFunction): Promise<any> {
    return res
      .status(HttpStatus.NOT_IMPLEMENTED)
      .json({});
  }

  async put(req: Request, res: Response, next: NextFunction): Promise<any> {
    return res
      .status(HttpStatus.NOT_IMPLEMENTED)
      .json({});
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<any> {
    return res
      .status(HttpStatus.NOT_IMPLEMENTED)
      .json({});
  }
}
