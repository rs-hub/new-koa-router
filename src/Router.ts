import compose from "koa-compose";
import Methods from './Endpoints';

interface IRouter  {
    routers<T>(): compose.ComposedMiddleware<T>;
}

export default class Router extends Methods implements IRouter {
    constructor() {
        super();
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
}
