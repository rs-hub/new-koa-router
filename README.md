# new-koa-router
Router for [Koa.js](https://github.com/koajs/koa)

[![NPM version](https://img.shields.io/npm/v/new-koa-router.svg?style=flat)](https://npmjs.org/package/new-koa-router)
[![NPM Downloads](https://img.shields.io/npm/dm/new-koa-router.svg?style=flat)](https://npmjs.org/package/new-koa-router)

## Installation

Install using [npm](https://www.npmjs.org/):
```sh
npm install new-koa-router
```

## Contributing

Please submit all issues and pull requests to the [new-koa-router](http://github.com/new-koa-router) repository!

## Tests

Run tests using `npm test`

## Support

If you have any problem or suggestion please open an issue [here](https://github.com/rs-hub/new-koa-router/issues).

## Example

**Simple**  
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

**Middleware**  
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
***Use***  
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

***Prefix***  
```typescript
const router = new Router({ prefix: "/users" });

router.get("/", (ctx) => {});
router.post("/:id", (ctx) => {});
```
