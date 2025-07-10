import { Request, Response, NextFunction } from 'express';
import os from 'os';
import { v4 as uuid } from 'uuid';

type CacheEntry = {
    value: object;
    expiresAt: number;
};

class Cache {

    private cache: Map<string, CacheEntry>;
    private TTL: number = 1000 * 60 * 10;

    constructor() {
        this.cache = new Map();
    }

    private get(key: string): object | undefined {
        const entry = this.cache.get(key);
        if (!entry) return undefined;
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return undefined;
        }
        return entry.value;
    }

    private set = (key: string, value: object): void => {
        const expiresAt = Date.now() + this.TTL;
        this.cache.set(key, { value, expiresAt });
    };

    private put = (key: string, value: object): void => {
        const actualEntry = this.cache.get(key);
        const expiresAt = Date.now() + this.TTL;
        if (actualEntry) {
            this.cache.set(key, { value: { ...actualEntry.value, ...value }, expiresAt });
        } else {
            this.cache.set(key, { value, expiresAt });
        }
    }

    private del(key: string): object | undefined {
        const entry = this.cache.get(key);
        this.cache.delete(key);
        return entry?.value;
    }

    private checkMemory() {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (entry.expiresAt < now) {
                this.cache.delete(key);
            }
        }

        const total = os.totalmem();
        const free = os.freemem();
        const used = total - free;

        const usedPercent = (used / total) * 100;
        if (usedPercent >= 90) {
            this.cache.delete(this.cache.keys().next().value as string);
            this.checkMemory();
        }
        return;
    }

    public ExpressSession(req: Request, res: Response, next: NextFunction): void {
        this.checkMemory();

        let sessionId = req.headers['session-id'];

        if (!sessionId) {
            sessionId = uuid();
            res.setHeader('session-id', sessionId);
        }

        return next();
    }

    public ExpressCache(req: Request, res: Response, next: NextFunction): void {

        const url = req.originalUrl || req.url;
        const method = req.method.toLowerCase();
        const origin = req.headers.origin || req.headers.host;
        const ip = req.ip;
        const userAgent = req.headers['user-agent'];
        const sessionId = req.headers['session-id'];

        let key = `${method}:${origin}:${url}:${ip}:${userAgent}:${sessionId}`;

        const cachedResponse = this.get(key) as {
            statusCode?: number,
            headers?: Record<string, string>,
            body?: unknown
        };

        if (cachedResponse) {
            console.log(`Cache hit for ${key}`);
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

        const originalStatus = res.status;
        let statusCode = 200;
        res.status = function (this: Response, code: number) {
            statusCode = code;
            return originalStatus.call(this, code);
        } as any;

        const headers: Record<string, string> = {};
        const originalSetHeader = res.setHeader;
        res.setHeader = function (this: Response, key: string, value: any) {
            headers[key] = value as string;
            return originalSetHeader.call(this, key, value);
        } as any;

        const originalJson = res.json.bind(res);
        res.json = (body: any): Response => {
            console.log(`Cache miss for ${key}`);
            this.set(key, {
                statusCode,
                headers,
                body
            });
            return originalJson(body);
        };

        next();
    }
}

const cache = new Cache();
export default cache;
export const ExpressCache = cache.ExpressCache.bind(cache);
export const ExpressSession = cache.ExpressSession.bind(cache);