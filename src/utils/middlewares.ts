import { Request, Response, NextFunction, RequestHandler } from 'express';
import Token from './token';

class Middleware {

    public FreeRoute(): RequestHandler {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            try {
                const { authorization } = req.headers || {};

                if (authorization) {
                    const token = authorization.split(' ')[1];
                    if (token) {
                        const decoded = await Token.Verify(token);
                        req.body.userId = decoded.id;
                    }
                }

                next();
                return;
            } catch (error) {
                res.status(401).json({ error: 'Invalid tokenbbbbbbb' });
            }
        }
    }

    public SafeRoute(): RequestHandler {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            try {
                const { authorization } = req.headers || {};

                if (!authorization) throw new Error();

                const token = authorization.split(' ')[1];
                if (!token || token === 'null' || token === 'undefined') {
                    res.status(401).json({ error: 'Token is required' });
                    return;
                }

                if (token) {
                    const decoded = await Token.Verify(token);
                    req.body.userId = decoded.id;
                    return next();
                }

            } catch (error) {
                res.status(401).json({ error: 'Invalid tokenaaaaaa' });
            }
        };
    }

}

export default new Middleware();