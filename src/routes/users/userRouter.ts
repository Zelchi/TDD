import { Router, Request, Response } from 'express';
import Middleware from '../../middlewares';
import UserController from './userController';

class UserRouter {

    private router: Router;

    constructor() {
        this.router = Router();
        this.Routes();
    }

    public Routes() {
        this.router.use(Middleware.FreeRoute());
        this.router.get('/', (req: Request, res: Response) => UserController.GetAll(req, res));
        this.router.get('/:id', (req: Request, res: Response) => UserController.GetById(req, res));
        this.router.post('/', (req: Request, res: Response) => UserController.Create(req, res));
        this.router.put('/:id', (req: Request, res: Response) => UserController.Update(req, res));
        this.router.delete('/:id', (req: Request, res: Response) => UserController.Delete(req, res));
        return this.router;
    }
}

export default new UserRouter().Routes();