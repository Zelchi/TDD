import express, { Application, Request, Response } from 'express';

class App {
    public express: Application;

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }

    private middleware(): void {
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: true }));
    }

    private routes(): void {
        this.express.get('/', (req: Request, res: Response) => {
            res.send('Hello World!'); 
        });

        this.express.get('/users', (req: Request, res: Response) => {
            res.json([
                { id: 1, name: 'John Doe' },
                { id: 2, name: 'Jane Doe' }
            ])
        });
    }

    public start(port: number): void {
        this.express.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}

export default new App().express;
export const Server = new App();