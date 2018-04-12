import { Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';

export async function examplePath(request: Request, response: Response, next: any) {
  console.log('Request headers: \n' + JSON.stringify(request.headers) + '\n');
  console.log('Request body: \n' + JSON.stringify(request.body) + '\n');

  response.status(HttpStatus.OK);
  response.json({});
}
