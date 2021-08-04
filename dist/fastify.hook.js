"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastifyProtectSwagger = void 0;
const common_1 = require("@nestjs/common");
const router = require("find-my-way");
const constatnt_1 = require("./constatnt");
function fastifyProtectSwagger(settings) {
    return (req, reply, next) => {
        const myWay = router({
            ignoreTrailingSlash: true,
            caseSensitive: false,
            defaultRoute: () => next(),
            onBadUrl: () => next(),
        });
        myWay.on(['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], settings.entryPath || constatnt_1.ENTRY_POINT_PROTECT, async () => {
            const token = req.cookies[settings.cookieKey || constatnt_1.SWAGGER_COOKIE_TOKEN_KEY];
            if (token) {
                if (await settings.cookieGuard(token))
                    return next();
            }
            return reply
                .status(common_1.HttpStatus.FOUND)
                .redirect(settings.redirectPath || constatnt_1.REDIRECT_TO_LOGIN);
        });
        return myWay.lookup(req, reply);
    };
}
exports.fastifyProtectSwagger = fastifyProtectSwagger;
exports.default = fastifyProtectSwagger;
