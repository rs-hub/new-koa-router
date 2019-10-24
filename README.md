# new-koa-router
Router for Koa.js

[![NPM version](https://img.shields.io/npm/v/new-koa-router.svg?style=flat)](https://npmjs.org/package/new-koa-router)
[![NPM Downloads](https://img.shields.io/npm/dm/new-koa-router.svg?style=flat)](https://npmjs.org/package/new-koa-router)

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

routerPrivate.use(koaJwt({ secret: 'key' }));
routerPrivate
    .get('/jwt', (ctx) => {
        ctx.body = ctx.state.user;
    });

app.use(routerPrivate.routes());
app.listen(3000);
```

***Redirect***  
```typescript
router.redirect('/source', '/destination');
```
or
```typescript
router.get("/source", (ctx) => {
    ctx.status = 301;
    ctx.redirect('/destination');
});
```
