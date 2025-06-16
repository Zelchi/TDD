import { Router, Request, Response } from 'express';
import Middleware from '../../utils/middlewares';
import UserController from './userController';

class UserRouter {

    private router: Router;

    constructor() {
        this.router = Router();
    }

    public Routes() {
        this.router.use(Middleware.FreeRoute());
        this.router.post('/reg', (req: Request, res: Response) => { UserController.Create(req, res) });
        this.router.post('/log', (req: Request, res: Response) => { UserController.Login(req, res) });
        this.router.use(Middleware.SafeRoute());
        this.router.get('/:id', (req: Request, res: Response) => { UserController.ReadId(req, res) });
        this.router.put('/:id', (req: Request, res: Response) => { UserController.Update(req, res) });
        this.router.delete('/del', (req: Request, res: Response) => { UserController.Delete(req, res) });
        return this.router;
    }
}

export default new UserRouter().Routes();