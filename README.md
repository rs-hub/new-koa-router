# new-koa-router
Router for Koa.js

**Example**  
```typescript
import Koa from "koa";
import Router from "new-koa-router";

const app = new Koa();
const router = new Router();

router
    .get("/users/:type/:id", (ctx) => ctx.body = ctx.params)
    .get("/posts", (ctx) => ctx.body = "GET /posts")
    .post("/users", (ctx) => ctx.body = "POST /users")
    .post("/posts", (ctx) => ctx.body = "POST /posts");

app.use(router.routes());
app.listen(3000);
```

**middleware**  
```typescript
const Middleware = (ctx, next) => {
    ctx.user  = {
        id: 1,
        username: "rs-hub",
    };
    return next();
};

router
    .get("/users", middleware, (ctx) => ctx.body = ctx.user)
    .get("/users/:type/:id", (ctx) => ctx.body = ctx.params)
    .get("/posts", (ctx) => ctx.body = "GET /posts")
    .post("/users", (ctx) => ctx.body = "POST /users")
    .post("/posts", (ctx) => ctx.body = "POST /posts");
```
***use***  
```typescript
import Koa from "koa";
import Router from "new-koa-router";
import koaJwt from 'koa-jwt';
import * as jwt from 'jsonwebtoken';
import * as bluebird from 'bluebird';

const app = new Koa();
const routerPrivate = new Router();
const routerPublic = new Router();

routerPrivate.use(koaJwt({ secret: 'key' }));
routerPrivate
    .get('/jwt', (ctx) => {
        ctx.body = ctx.state.user;
    });

const jwtSign = bluebird.promisify(jwt.sign);
routerPublic
    .post('/jwt', async (ctx) => {
        const token = await jwtSign({ id: 1, username: 'rs-hub' }, 'key');
        ctx.body = { token };
    });

app.use(routerPrivate.routes());
app.use(routerPublic.routes());
app.listen(3000);
```
