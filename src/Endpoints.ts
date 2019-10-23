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

    private registerEndpoint(method: string, middleware, path) {
        this.stack.push({ method, middleware, path, regexp: regexp(path) });
        return this;
    }

    public use(middleware) {
        this.middleware.push(middleware);
        return this
    }
}
