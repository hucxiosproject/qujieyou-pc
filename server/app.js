import koa from "koa";const APP_NAME = "server_template";var app = koa();app.use(require("koa-bodyparser")());app.use(require("./middlewares/static")("dist"));app.listen(5006);console.log("mail.bengjiujie.com 5006");