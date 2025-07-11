import { Router, Request, Response } from 'express';
import Auth from '../../utils/Auth';
import UserController from './userController';

class UserRouter {

    private router: Router;

    constructor() {
        this.router = Router();
    }

    public Routes() {
        this.router.use(Auth.Free());
        this.router.post('/reg', (req: Request, res: Response) => { UserController.Create(req, res) });
        this.router.post('/log', (req: Request, res: Response) => { UserController.Login(req, res) });
        this.router.use(Auth.Safe());
        this.router.get('/', (req: Request, res: Response) => { UserController.ReadId(req, res) });
        this.router.put('/', (req: Request, res: Response) => { UserController.Update(req, res) });
        this.router.delete('/', (req: Request, res: Response) => { UserController.Delete(req, res) });
        return this.router;
    }
}

export default new UserRouter().Routes();