import express, { Application } from 'express';
import UserRouter from './routes/users/userRouter';

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

    public Start(port: number) {
        this.express.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}

export default new App().express;
export const Server = new App();