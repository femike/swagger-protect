"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastifyOnModuleInit = void 0;
const constatnt_1 = require("./constatnt");
const middleware_1 = require("./middleware");
const regexp_replace_1 = require("./utils/regexp-replace");
async function fastifyOnModuleInit(server, options, guard) {
    const { logIn, useUI, guard: OptionsGuard, ...protect } = options;
    const { swaggerPath } = protect;
    server.addHook('onRequest', (0, middleware_1.fastifyProtectSwagger)({
        cookieKey: protect.cookieKey || constatnt_1.SWAGGER_COOKIE_TOKEN_KEY,
        loginPath: protect.loginPath || constatnt_1.REDIRECT_TO_LOGIN,
        swaggerPath: (typeof swaggerPath === 'string'
            ? (0, regexp_replace_1.replaceApi)(swaggerPath)
            : swaggerPath) || constatnt_1.SWAGGER_DEFAULT_PATH,
        guard,
    }));
}
exports.fastifyOnModuleInit = fastifyOnModuleInit;
exports.default = fastifyOnModuleInit;
