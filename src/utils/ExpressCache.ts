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

    private Get = (key: string): object | undefined => {
        const entry = this.CACHE.get(key);
        if (!entry) return undefined;
        if (Date.now() > entry.expiresAt) {
            this.Del(key);
            return undefined;
        }
        return entry.value;
    }

    private Set = (key: string, value: object): void => {
        const expiresAt = Date.now() + this.TTL;
        this.CACHE.set(key, { value, expiresAt });
    };

    private Del = (key: string): void => {
        this.CACHE.delete(key);
    }

    private CheckMemorySpace() {
        console.log(`[${(this.MAX_MEMORY / 1024 / 1024).toFixed(0)}MB] - [${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(0)}MB] - [${this.CACHE.size}]`);

        const now = Date.now();
        for (const [key, entry] of this.CACHE.entries()) {
            if (entry.expiresAt < now) {
                this.Del(key);
            }
        }

        const used = process.memoryUsage().heapUsed;
        const limit = this.MAX_MEMORY;

        if (used >= limit) {
            this.Del(this.CACHE.keys().next().value as string);
            this.CheckMemorySpace();
        }
        return;
    }

    public Cache(req: Request, res: Response, next: NextFunction): void {

        if (req.method !== 'GET') {
            return next();
        }

        const userId = req.headers['authorization'] || "anonymous";
        const key = `${req.method}:${req.originalUrl}:${userId}`;

        const cachedResponse = this.Get(key) as {
            statusCode?: number,
            headers?: Map<string, string>,
            body?: unknown
        };

        if (cachedResponse) {
            console.log(`Cache hit for ${key}`);
        } else {
            console.log(`Cache miss for ${key}`);
        }

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

        const originalSetHeader = res.setHeader.bind(res);
        const originalJson = res.json.bind(res);
        const originalStatus = res.status.bind(res);

        const headers: Map<string, string> = new Map();

        let statusCode = res.statusCode;

        res.status = (code: number): Response => {
            statusCode = code;
            return originalStatus(code);
        };

        res.setHeader = (key: string, value: string) => {
            headers.set(key, value);
            return originalSetHeader(key, value);
        };

        res.json = (body: string): Response => {
            if (statusCode === 200) {
                this.Set(key, { statusCode, headers, body });
            }
            return originalJson(body);
        };

        this.CheckMemorySpace();
        return next();
    }
}

const expressCache = new ExpressCache();
export default expressCache.Cache.bind(expressCache);