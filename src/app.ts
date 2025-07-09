import express, { Application } from 'express';
import UserRouter from './routes/users/userRouter';
import Database from './utils/database';
import Cache from './utils/cache';

class App {
    public express: Application;

    constructor() {
        this.express = express();
        this.Middleware();
        this.Routes();
    }

    private Middleware() {
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: true }));
    }

    private Routes() {
        this.express.get('/', (_, res) => { res.status(200).send('Hello World!') });
        this.express.use('/users', UserRouter);
    }

    public async Start(port: number) {
        try {
            await Database.Initialize();
            this.express.listen(port, () => {
                console.log(`Server is running on port ${port}`);
            });
        } catch (error) {
            console.error("Failed to start server:", error);
            process.exit(1);
        }
    }
}

export const Server = new App();
export default Server.express;