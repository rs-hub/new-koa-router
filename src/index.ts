import compose from "koa-compose";

interface IMethod {
    get(
        path: string,
    ): Router;

    post(
        path: string,
    ): Router;

    delete(
        path: string,
    ): Router;

    put(
        path: string,
    ): Router;

    path(
        path: string,
    ): Router;

}

interface IRouter extends IMethod {
    routers<T>(): compose.ComposedMiddleware<T>;
}

export default class Router implements IRouter {
    private readonly stack: Array<{
        method: string,
        middleware: [(ctx, next) => {}],
        path: string,
    }>;

    constructor() {
        this.stack = [];
    }

    public get(path: string, ...middleware): Router {
        return this.registerRouter("GET", middleware, path);
    }

    public post(path: string, ...middleware): Router {
        return this.registerRouter("POST", middleware, path);
    }

    public delete(path: string, ...middleware): Router {
        return this.registerRouter("DELETE", middleware, path);
    }

    public path(path: string, ...middleware): Router {
        return this.registerRouter("PATH", middleware, path);
    }

    public put(path: string, ...middleware): Router {
        return this.registerRouter("PUT", middleware, path);
    }

    public routers() {
        const middleware = [];

        for (const route of this.stack) {

            route.middleware.forEach((el) => {
                const func = (ctx, next) => {
                    if (ctx.path === route.path && ctx.method === route.method) {
                        return el(ctx, next);
                    }
                    return next();
                };
                middleware.push(func);
            });
        }
        return compose(middleware);
    }

    private registerRouter(method: string, middleware, path) {
        this.stack.push({ method, middleware, path });
        return this;
    }
}
