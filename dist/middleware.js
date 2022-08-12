"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressProtectSwagger = exports.registerExpressProtectSwagger = exports.fastifyProtectSwagger = void 0;
const cookie_parser_1 = require("cookie-parser");
const path_to_regexp_1 = require("path-to-regexp");
const common_1 = require("@nestjs/common");
const utils_1 = require("./utils");
const constatnt_1 = require("./constatnt");
function middlewareTest(req, reply, next, settings, url) {
    try {
        const token = req.cookies[settings.cookieKey || constatnt_1.SWAGGER_COOKIE_TOKEN_KEY];
        if (token) {
            if (typeof settings.guard === 'function') {
                if (settings.guard(token))
                    return next();
                else
                    return reply.status(common_1.HttpStatus.FOUND).redirect(url);
            }
            else if (typeof settings.guard === 'object') {
                return settings.guard
                    .canActivate(token)
                    .then(result => result ? next() : reply.status(common_1.HttpStatus.FOUND).redirect(url))
                    .catch(err => {
                    throw new common_1.BadRequestException(err);
                });
            }
        }
    }
    catch (err) {
        return reply
            .status(common_1.HttpStatus.FOUND)
            .redirect(`${url}&message=${decodeURI(err.message)}`);
    }
    return reply.status(common_1.HttpStatus.FOUND).redirect(url);
}
function middleware(settings) {
    return (req, reply, next) => {
        const url = settings.loginPath + `?backUrl=${decodeURI(req.url)}`;
        const path = settings.swaggerPath;
        if (settings.swaggerPath instanceof RegExp) {
            if (settings.swaggerPath.test(req.url))
                middlewareTest(req, reply, next, settings, url);
            else
                return next();
        }
        else if (typeof path === 'string') {
            const regexp = (0, path_to_regexp_1.default)(path);
            if (regexp.test(req.url))
                middlewareTest(req, reply, next, settings, url);
            else
                return next();
        }
        else {
            throw new Error(`swaggerPath must be a string or RegExp`);
        }
    };
}
exports.fastifyProtectSwagger = middleware;
const registerExpressProtectSwagger = (app, settings) => {
    const httpAdapter = app.getHttpAdapter();
    (0, exports.expressProtectSwagger)(httpAdapter, settings);
};
exports.registerExpressProtectSwagger = registerExpressProtectSwagger;
const expressProtectSwagger = (app, settings) => {
    app.use((0, cookie_parser_1)());
    const path = (0, utils_1.validatePath)(settings.swaggerPath || constatnt_1.SWAGGER_DEFAULT_PATH);
    const middle = (req, res, next) => {
        const url = (settings.loginPath || constatnt_1.REDIRECT_TO_LOGIN) +
            `?backUrl=${decodeURI(req.url)}`;
        return middlewareTest(req, res, next, {
            cookieKey: settings.cookieKey || constatnt_1.SWAGGER_COOKIE_TOKEN_KEY,
            guard: settings.guard,
        }, url);
    };
    app.get(path, middle);
    app.get(path + '-json', middle);
};
exports.expressProtectSwagger = expressProtectSwagger;
