import * as express from 'express';

export interface Request extends express.Request {};
export interface Response extends express.Response {};
export interface Next extends express.NextFunction {};
