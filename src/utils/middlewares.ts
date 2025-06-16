import { Request, Response, NextFunction, RequestHandler } from 'express';
import Token from './token';

class Middleware {

    public FreeRoute(): RequestHandler {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            try {
                const { authorization } = req.headers || {};
                const { userId } = req.body || {};

                if (!authorization) {
                    next();
                    return;
                }

                if (userId) {
                    res.status(400).json({ error: `Não é possivel colocar o userId na body` });
                    return;
                }

                if (authorization) {
                    const token = authorization.split(' ')[1];
                    if (token) {
                        const decoded = Token.Verify(token);
                        req.body = { ...req.body, userId: decoded.id };
                        next();
                        return;
                    }
                }

                next();
                return;
            } catch (error) {
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        }
    }

    public SafeRoute(): RequestHandler {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            try {
                const { authorization } = req.headers || {};

                if (!authorization) {
                    res.status(401).json({ error: 'Cade a authorization?' });
                    return;
                }

                const token = authorization.split(' ')[1];
                if (!token || token === 'null' || token === 'undefined') {
                    res.status(401).json({ error: 'Token sumiu?' });
                    return;
                }

                if (token) {
                    const decoded = Token.Verify(token);
                    req.body.userId = decoded.id;
                    return next();
                }

            } catch (error) {
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        };
    }

}

export default new Middleware();