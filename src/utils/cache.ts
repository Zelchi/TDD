import { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';
import os from 'os';

class Cache {

    private CACHE: Map<string, { value: object, expiresAt: number }>;
    private MAX_MEMORY: number;
    private TTL: number;

    constructor() {
        this.CACHE = new Map();
        this.MAX_MEMORY = os.totalmem() * 0.5;
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
            headers?: Map<string, string>,
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

        const headers: Map<string, string> = new Map();
        const originalSetHeader = res.setHeader;
        res.setHeader = function (this: Response, key: string, value: any) {
            headers.set(key, value as string);
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
export const ExpressSession = cache.ExpressSession.bind(cache);
export const ExpressCache = cache.ExpressCache.bind(cache);