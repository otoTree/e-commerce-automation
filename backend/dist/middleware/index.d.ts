import express, { type Application } from 'express';
declare const corsOptions: {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void;
    credentials: boolean;
    optionsSuccessStatus: number;
    methods: string[];
    allowedHeaders: string[];
};
declare const requestLogger: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
declare const errorHandler: (error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => void;
declare const notFoundHandler: (req: express.Request, res: express.Response) => void;
declare const securityHeaders: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
declare const bodyParserConfig: {
    json: {
        limit: string;
    };
    urlencoded: {
        limit: string;
        extended: boolean;
    };
};
export declare const setupMiddleware: (app: Application) => void;
export declare const setupErrorHandling: (app: Application) => void;
export { corsOptions, requestLogger, errorHandler, notFoundHandler, securityHeaders, bodyParserConfig };
//# sourceMappingURL=index.d.ts.map