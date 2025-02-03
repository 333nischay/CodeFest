import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import { ApiError } from './utils/ApiError.js'
import { ApiResponse } from './utils/ApiResponse.js'
import passport from 'passport'
import PassportConfig from './controllers/passport.js'
const app = express();
const corsOptions = {
    credentials: true,
    origin: process.env.CORS_ORIGIN.trim(), // Trim any whitespace and trailing slash
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie']
};
PassportConfig(passport);
app.use(cors(corsOptions))
app.use(express.json({limit: '50kb'}));
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

import userRouter from './routes/user.routes.js'
import judge0 from './routes/judge0.route.js'
import folderRouter from './routes/folder.route.js'
import fileRouter from './routes/file.route.js'
import CodeSuggestion from './routes/sentiment.route.js'
import WorkSpaceRouter from './routes/workspace.routes.js'  
//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/judge0", judge0);
app.use("/api/v1/folder", folderRouter);
app.use("/api/v1/file", fileRouter);
app.use("/api/v1/suggestion", CodeSuggestion);
app.use("/api/v1/workspace", WorkSpaceRouter);

app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json(new ApiResponse(err.statusCode, null, err.message));
    } else {
        res.status(500).json(new ApiResponse(500, null, 'Internal Server Error'));
    }
});


export {app}