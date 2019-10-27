import regexp from "path-to-regexp";

interface IEndpoints {
    get(
        path: string,
        ...middleware
    ): Endpoints;

    post(
        path: string,
        ...middleware
    ): Endpoints;

    delete(
        path: string,
        ...middleware
    ): Endpoints;

    put(
        path: string,
        ...middleware
    ): Endpoints;

    path(
        path: string,
        ...middleware
    ): Endpoints;
}

export default class Endpoints implements IEndpoints {
    public prefix: string | undefined;
    public readonly stack: Array<{
        method: string,
        middleware: [(ctx, next) => {}],
        path: string,
        regexp: RegExp,
    }>;
    public middleware: any[];

    constructor() {
        this.stack = [];
        this.middleware = [];
    }

    public get(path: string, ...middleware): Endpoints {
        return this.registerEndpoint("GET", middleware, path);
    }

    public post(path: string, ...middleware): Endpoints {
        return this.registerEndpoint("POST", middleware, path);
    }

    public delete(path: string, ...middleware): Endpoints {
        return this.registerEndpoint("DELETE", middleware, path);
    }

    public path(path: string, ...middleware): Endpoints {
        return this.registerEndpoint("PATH", middleware, path);
    }

    public put(path: string, ...middleware): Endpoints {
        return this.registerEndpoint("PUT", middleware, path);
    }

    public all(path: string, ...middleware): Endpoints {
        return this.registerEndpoint("ALL", middleware, path);
    }

    public redirect(path: string, toPath: string): Endpoints {
        return this.registerEndpoint("ALL", [(ctx) => {
            ctx.status = 301;
            ctx.redirect(toPath);
        }], path);
    }

    public use(middleware) {
        this.middleware.push(middleware);
        return this;
    }

    private registerEndpoint(method: string, middleware, path) {
        if (this.prefix) {
            const prefix = `/${this.prefix}`;
            path = path !== "/" ? prefix + path : prefix;
        }
        this.stack.push({ method, middleware, path, regexp: regexp(path) });
        return this;
    }
}
