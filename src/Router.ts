import compose from "koa-compose";
import Methods from "./Endpoints";

interface IRouter {
    routes<T>(): compose.ComposedMiddleware<T>;
}

export default class Router extends Methods implements IRouter {
    constructor() {
        super();
    }

    public routes() {
        const middleware = [];

        for (const route of this.stack) {
            route.middleware.forEach((el) => {
                middleware.push((ctx, next) => {
                    if (ctx.path === route.path && ctx.method === route.method) {
                        return el(ctx, next);
                    }
                    return next();
                });
            });
        }
        return compose(middleware);
    }
}
