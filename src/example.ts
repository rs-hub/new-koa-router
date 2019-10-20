import Koa from "koa";
import Router from "../src/index";

const app = new Koa();
const router = new Router();

router
    .get("/users", (ctx) => ctx.body = "GET /users")
    .get("/posts", (ctx) => ctx.body = "GET /posts")
    .post("/users", (ctx) => ctx.body = "POST /users")
    .post("/posts", (ctx) => ctx.body = "POST /posts");

app.use(router.routers());
app.listen(3000);
