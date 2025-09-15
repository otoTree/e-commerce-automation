import cors from 'cors';
import express from 'express';
export const setupMiddleware = (app) => {
    // CORS middleware
    app.use(cors());
    // Body parsing middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
};
//# sourceMappingURL=index.js.map