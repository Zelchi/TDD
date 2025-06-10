import {Server} from './src/app';
import dotenv from 'dotenv';
dotenv.config();

Server.start(Number(process.env.PORT) || 8080);