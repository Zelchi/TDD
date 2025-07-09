import os from 'os';

class Cache {

    private cache: Map<string, object>;

    constructor() {
        this.cache = new Map();
    }

    private checkMemory() {
        const total = os.totalmem();
        console.log(total);
        const free = os.freemem();
        console.log(free);
        const usedPercent = ((total - free) / total) * 100;
        if (usedPercent >= 90) {
            const temp = this.cache.delete(this.cache.keys().next().value as string);
            if (temp) this.checkMemory()
        }

        console.log(this.cache);
        return;
    }

    public get(key: string): object | undefined {
        return this.cache.get(key);
    }

    public set = (key: string, value: object): void => {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
        this.cache.set(key, value);
    };

    public put = (key: string, value: object): void => {
        const actualValue = this.cache.get(key);
        if (actualValue) {
            this.cache.set(key, { ...actualValue, ...value });
        } else {
            this.cache.set(key, value);
        }
    }

    public del(key: string): object | undefined {
        const temp = this.cache.get(key);
        this.cache.delete(key);
        return temp;
    }
}

export default new Cache();