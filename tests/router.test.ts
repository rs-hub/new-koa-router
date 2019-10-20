import Koa from "koa";
import { expect } from "chai";
import request from 'supertest';
import Router from "../src/index";

describe('Router', async () => {
    it('creates new router', async () => {
        const router = new Router();
        expect(router).to.be.an.instanceof(Router);
    });
    it('multiple middleware', async () => {
        const app = new Koa();
        const router = new Router();

        const middleware1 = (ctx, next) => {
            ctx.state.user = {
                id: 1
            };
            return next();
        };

        const middleware2 = (ctx, next) => {
            ctx.state.user.username = 'rs-hub';
            return next();
        };

        router.get("/users", middleware1, middleware2, (ctx) => ctx.body = ctx.state.user);

        app.use(router.routes());

        const server = app.listen(3000);
        const res = await request(server).get('/users').expect(200);

        expect(res.body).to.eql({ "id": 1, "username": "rs-hub" });

        server.close();
    });
    it('shares context', async () => {
        const app = new Koa();
        const router1 = new Router();
        const router2 = new Router();

        router1.get("/users", (ctx, next) => {
            ctx.state.user = {
                username: 'rs-hub'
            };
            return next();
        });
        router1.get("/users", (ctx) => ctx.body = ctx.state.user);

        app.use(router1.routes());
        app.use(router2.routes());

        const server = app.listen(3000);
        const res = await request(server).get('/users').expect(200);

        expect(res.body).to.eql({ "username": "rs-hub" });

        server.close();
    });

    it('async/await', async () => {
        const app = new Koa();
        const router = new Router();

        router.get("/async", (ctx) => {
            return new Promise(resolve => {
                setTimeout(function () {
                    ctx.body = { message: 'async/await' };
                    resolve();
                }, 1);
            })
        });

        app.use(router.routes());

        const server = app.listen(3000);
        const res = await request(server).get('/async').expect(200);

        expect(res.body.message).eql('async/await');

        server.close();
    });

    it('params', async () => {
        const app = new Koa();
        const router = new Router();

        router.get("/params/:id/:type", (ctx) => ctx.body = ctx.params);
        router.get("/params/:lastName/:firstName/:id/:type", (ctx) => ctx.body = ctx.params);

        app.use(router.routes());

        const server = app.listen(3000);
        const res1 = await request(server).get('/params/1/regular').expect(200);
        const res2 = await request(server).get('/params/ava/MacDonald/1/regular').expect(200);

        expect(res1.body).to.eql({
            id: '1',
            type: 'regular'
        });

        expect(res2.body).to.eql({
            lastName: 'ava',
            firstName: 'MacDonald',
            id: '1',
            type: 'regular'
        });

        server.close();
    })
});
