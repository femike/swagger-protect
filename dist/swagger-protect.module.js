"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerProtect = void 0;
const common_1 = require("@nestjs/common");
const _1 = require(".");
const host_async_module_1 = require("./host-async.module");
const host_module_1 = require("./host.module");
const swagger_protect_host_module_1 = require("./swagger-protect-host.module");
let SwaggerProtect = class SwaggerProtect extends swagger_protect_host_module_1.SwaggerProtectHost {
    static forRoot(options) {
        return host_module_1.SwaggerProtectHostModule.forRoot(options);
    }
    static async forRootAsync(options) {
        return await host_async_module_1.SwaggerProtectHostAsyncModule.forRootAsync(options);
    }
};
SwaggerProtect = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: _1.SWAGGER_PROTECT_OPTIONS,
                useValue: {
                    cookieKey: _1.SWAGGER_COOKIE_TOKEN_KEY,
                    loginPath: _1.REDIRECT_TO_LOGIN,
                    swaggerPath: _1.ENTRY_POINT_PROTECT,
                    useUI: false,
                },
            },
            {
                provide: _1.SWAGGER_GUARD,
                useClass: class SwaggerGuard {
                    async canActivate() {
                        return false;
                    }
                },
            },
        ],
    })
], SwaggerProtect);
exports.SwaggerProtect = SwaggerProtect;
