import dotenv from 'dotenv';
import { Sequelize } from "sequelize-typescript";
import {Superhero} from "./models/Superhero";
import {ImageSuperHero} from "./models/ImageSuperhero";
dotenv.config();
export const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    models: [Superhero, ImageSuperHero],
    logging: false,
});