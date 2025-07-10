import { Request, Response, NextFunction } from 'express';

class IPBan {
    private REQUEST_IP: Map<string, { count: number, lastRequest: number }> = new Map();
    private RATE_LIMIT = 100;
    private RATE_WINDOW = 60 * 1000;

    public ExpressSession(req: Request, res: Response, next: NextFunction): void {
        const ip = req.ip ?? '';
        const now = Date.now();
        const entry = this.REQUEST_IP.get(ip);

        if (entry && now - entry.lastRequest < this.RATE_WINDOW) {
            entry.count++;
            entry.lastRequest = now;
            if (entry.count > this.RATE_LIMIT) {
                res.status(429).json({ error: 'Too many requests' });
                return;
            }
        } else {
            this.REQUEST_IP.set(ip, { count: 1, lastRequest: now });
        }

        return next();
    }
}

const ipBan = new IPBan();
export default ipBan.ExpressSession.bind(ipBan);