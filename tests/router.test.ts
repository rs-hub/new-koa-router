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

        const server = app.listen();
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

        const server = app.listen();
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

        const server = app.listen();
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

        const server = app.listen();
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
    });

    it('method all', async () => {
        const app = new Koa();
        const router = new Router();

        router.all("/all", (ctx) => ctx.body = {
            msg: 'all'
        });

        app.use(router.routes());

        const server = app.listen();
        const res1 = await request(server).get('/all').expect(200);
        const res2 = await request(server).post('/all').expect(200);
        const res3 = await request(server).put('/all').expect(200);

        expect(res1.body).to.eql({ msg: 'all' });
        expect(res2.body).to.eql({ msg: 'all' });
        expect(res3.body).to.eql({ msg: 'all' });

        server.close();
    });

    it('prefix', async () => {
        const app = new Koa();
        const router = new Router({ prefix: '/users'});

        router.get("/", (ctx) => ctx.body = {});
        router.get("/:id/:type", (ctx) => ctx.body = ctx.params);
        router.get("/:lastName/:firstName/:id/:type", (ctx) => ctx.body = ctx.params);

        app.use(router.routes());

        const server = app.listen();
        const res1 = await request(server).get('/users/1/regular').expect(200);
        const res2 = await request(server).get('/users/ava/MacDonald/1/regular').expect(200);
         await request(server).get('/users').expect(200);

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
    });
});

describe('Router redirect', () => {
    it('registers redirect', (done) => {
        const app = new Koa();
        const router = new Router();

        expect(router.redirect).to.be.an('function');
        router.redirect('/1', '/users');
        router.redirect('/2', '/users');

        app.use(router.routes());

        expect(router.stack).to.length(2);
        expect(router.stack[0]).to.haveOwnProperty('path', '/1');
        expect(router.stack[1]).to.haveOwnProperty('path', '/2');

        done();
    });

    it('redirects using', async () => {
        const app = new Koa();
        const router = new Router();

        router.redirect('/1', '/users');

        router.get("/2", (ctx) => {
            ctx.status = 301;
            ctx.redirect('/users');
        });

        router.get("/users", () => {});

        app.use(router.routes());

        const server = app.listen();
        const res1 = await request(server).get('/1').expect(301);
        const res2 = await request(server).get('/2').expect(301);

        expect(res1.header).to.haveOwnProperty('location', '/users');
        expect(res2.header).to.haveOwnProperty('location', '/users');

        server.close();
    });
});
