import Koa from "koa";
import Router from "../src/index";

const app = new Koa();
const router = new Router();

const middleware = (ctx, next) => {
    ctx.user  = {
        id: 1,
        username: "rs-hub",
    };
    return next();
};

router
    .get("/users/:type/:id", middleware, (ctx) => ctx.body = ctx.params)
    .post("/users", (ctx) => ctx.body = "POST /users")
    .get("/posts", (ctx) => ctx.body = "GET /posts")
    .post("/posts", (ctx) => ctx.body = "POST /posts");

app.use(router.routes());
app.listen(3000);
