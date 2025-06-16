import {Server} from './src/app';
import dotenv from 'dotenv';
dotenv.config();

Server.Start(8080);