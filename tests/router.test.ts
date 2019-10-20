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
});
