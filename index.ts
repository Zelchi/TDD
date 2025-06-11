import {Server} from './src/app';
import dotenv from 'dotenv';
dotenv.config();

Server.Start(Number(process.env.PORT) || 8080);