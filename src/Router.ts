import compose from "koa-compose";
import Methods from "./Endpoints";

interface IRouter {
    routes<T>(): compose.ComposedMiddleware<T>;
}

export default class Router extends Methods implements IRouter {
    constructor({ prefix }: { prefix?: string } = {}) {
        super();
        this.prefix = prefix;
    }

    public routes() {
        for (const route of this.stack) {
            route.middleware.forEach((el) => {
                this.middleware.push((ctx, next) => {
                    if ((ctx.method === route.method || route.method === "ALL") && route.regexp.test(ctx.path)) {
                        ctx.params = this.buildParams(decodeURIComponent(ctx.path), route.regexp, route.path);
                        return el(ctx, next);
                    }
                    return next();
                });
            });
        }
        return compose(this.middleware);
    }

    private buildParams(url, regexp, path) {
        const key = path.match(regexp).slice(1).map((el) => el.replace(":", ""));
        return url.match(regexp).slice(1).reduce((prev, current, i) => {
            return Object.assign(prev, { [key[i]]: current });
        }, {});
    }
}
