import { Request, Response, NextFunction } from 'express';

class ExpressCache {

    private CACHE: Map<string, { value: object, expiresAt: number }>;
    private MAX_MEMORY: number;
    private TTL: number;

    constructor() {
        this.CACHE = new Map();
        this.MAX_MEMORY = 1024 * 1024 * 1024 * 10;
        this.TTL = 1000 * 60 * 10;
    }

    private get(key: string): object | undefined {
        const entry = this.CACHE.get(key);
        if (!entry) return undefined;
        if (Date.now() > entry.expiresAt) {
            this.CACHE.delete(key);
            return undefined;
        }
        return entry.value;
    }

    private set = (key: string, value: object): void => {
        const expiresAt = Date.now() + this.TTL;
        this.CACHE.set(key, { value, expiresAt });
    };

    private checkMemory() {
        console.log(`[${(this.MAX_MEMORY / 1024 / 1024).toFixed(0)}MB] - [${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(0)}MB] - [${this.CACHE.size}]`);
        const now = Date.now();
        for (const [key, entry] of this.CACHE.entries()) {
            if (entry.expiresAt < now) {
                this.CACHE.delete(key);
            }
        }

        const used = process.memoryUsage().heapUsed;
        const limit = this.MAX_MEMORY;

        if (used >= limit) {
            this.CACHE.delete(this.CACHE.keys().next().value as string);
            this.checkMemory();
        }
        return;
    }

    public Cache(req: Request, res: Response, next: NextFunction): void {

        if (req.method !== 'GET') {
            return next();
        }

        const userId = req.headers['user-id'] || "anonymous";
        const key = `${req.method}:${req.originalUrl}:${userId}`;

        const cachedResponse = this.get(key) as {
            statusCode?: number,
            headers?: Map<string, string>,
            body?: unknown
        };

        if (cachedResponse) {
            if (cachedResponse.statusCode) {
                res.status(cachedResponse.statusCode);
            }
            if (cachedResponse.headers) {
                Object.entries(cachedResponse.headers).forEach(([key, value]) => {
                    res.setHeader(key, value);
                });
            }
            res.json(cachedResponse.body);
            return;
        }

        this.checkMemory();

        const originalStatus = res.status.bind(res);
        const originalSetHeader = res.setHeader.bind(res);
        const originalJson = res.json.bind(res);

        let statusCode = 100;

        const headers: Map<string, string> = new Map();

        res.status = (code: number) => {
            statusCode = code;

            return originalStatus(code);
        };

        res.setHeader = (key: string, value: string) => {
            headers.set(key, value);

            return originalSetHeader(key, value);
        };

        res.json = (body: string): Response => {
            this.set(key, { statusCode, headers, body });

            return originalJson(body);
        };


        this.checkMemory();
        return next();
    }
}

const expressCache = new ExpressCache();
export default expressCache.Cache.bind(expressCache);