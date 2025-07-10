import {Server} from './src/App';
import dotenv from 'dotenv';
dotenv.config();

Server.Start(Number(process.env.PORT));