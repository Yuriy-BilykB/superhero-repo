import {Request, Response, NextFunction} from "express";
import express from 'express';
import { sequelize } from "./db/db";
import cors from 'cors';
import dotenv from 'dotenv';
import SuperheroRouter from "./routers/SuperheroRouter";
import ImageSuperheroRouter from "./routers/ImageSuperheroRouter";
import {AppError} from "./authMiddleware/AppError";
dotenv.config();


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true
    })
);


app.use('/', SuperheroRouter);
app.use('/', ImageSuperheroRouter);

app.use((err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    if (err instanceof AppError) {
        res.status(err.status).json({
            error: {
                message: err.message,
                code: err.code,
            }
        });
    } else {
        res.status(500).json({
            error: {
                message: "Internal Server Error",
                code: "INTERNAL_ERROR",
            }
        });
    }
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ DB connected");
        await sequelize.sync({alter: true});

        app.listen(5000, () => {
            console.log("🚀 Server running on port 5000");
        });
    } catch (error) {
        console.error("❌ DB error:", error);
    }
})();

