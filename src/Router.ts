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
                    if (route.regexp.test(ctx.path) && ctx.method === route.method) {
                        ctx.params = this.buildParams(decodeURIComponent(ctx.path), route.regexp, route.path);
                        return el(ctx, next);
                    }
                    return next();
                });
            });
        }
        return compose(middleware);
    }

    private buildParams(url, regexp, path) {
        const key = path.match(regexp).slice(1).map((el) => el.replace(":", ""));
        return url.match(regexp).slice(1).reduce((prev, current, i) => {
            return Object.assign(prev, { [key[i]]: current });
        }, {});
    }
}
