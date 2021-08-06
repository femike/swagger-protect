"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressProtectSwagger = exports.fastifyProtectSwagger = void 0;
const common_1 = require("@nestjs/common");
const router = require("find-my-way");
const constatnt_1 = require("./constatnt");
function middleware(settings) {
    return (req, reply, next) => {
        const myWay = router({
            ignoreTrailingSlash: true,
            caseSensitive: false,
            defaultRoute: () => next(),
            onBadUrl: () => next(),
        });
        myWay.on(['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], settings.swaggerPath || constatnt_1.ENTRY_POINT_PROTECT, async () => {
            const token = req.cookies[settings.cookieKey || constatnt_1.SWAGGER_COOKIE_TOKEN_KEY];
            if (token) {
                if (typeof settings.guard === 'function') {
                    if (await settings.guard(token))
                        return next();
                }
                else if (typeof settings.guard === 'object') {
                    if (await settings.guard.canActivate(token))
                        return next();
                }
            }
            const url = (settings.loginPath || constatnt_1.REDIRECT_TO_LOGIN) +
                `?backUrl=${escape(req.url)}`;
            return reply.status(common_1.HttpStatus.FOUND).redirect(url);
        });
        return myWay.lookup(req, reply);
    };
}
exports.fastifyProtectSwagger = middleware;
exports.expressProtectSwagger = middleware;
