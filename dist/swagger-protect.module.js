"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SwaggerProtectCore_1, SwaggerProtect_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerProtect = exports.SwaggerProtectCore = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const _1 = require(".");
const protect_midleware_1 = require("./protect.midleware");
const swagger_protect_controller_1 = require("./swagger-protect.controller");
let SwaggerProtectCore = SwaggerProtectCore_1 = class SwaggerProtectCore {
    static forRoot(options = {
        cookieKey: _1.SWAGGER_COOKIE_TOKEN_KEY,
        loginPath: _1.REDIRECT_TO_LOGIN,
        swaggerPath: _1.ENTRY_POINT_PROTECT,
        guard: (token) => !!token,
        useUI: true,
    }) {
        const moduleOptions = {
            provide: _1.SWAGGER_PROTECT_OPTIONS,
            useValue: options,
        };
        const staticOptions = {
            provide: serve_static_1.SERVE_STATIC_MODULE_OPTIONS,
            useValue: {
                rootPath: path_1.join(__dirname, '..', 'ui/dist'),
            },
        };
        return {
            module: SwaggerProtectCore_1,
            providers: [moduleOptions, staticOptions, ...serve_static_1.serveStaticProviders],
            exports: [moduleOptions, staticOptions],
            controllers: options.useUI && options.loginPath === _1.ENTRY_POINT_PROTECT
                ? [swagger_protect_controller_1.SwaggerProtectController]
                : [],
        };
    }
};
SwaggerProtectCore = SwaggerProtectCore_1 = __decorate([
    common_1.Module({})
], SwaggerProtectCore);
exports.SwaggerProtectCore = SwaggerProtectCore;
let SwaggerProtect = SwaggerProtect_1 = class SwaggerProtect {
    ngOptions;
    options;
    loader;
    httpAdapterHost;
    constructor(ngOptions, options, loader, httpAdapterHost) {
        this.ngOptions = ngOptions;
        this.options = options;
        this.loader = loader;
        this.httpAdapterHost = httpAdapterHost;
    }
    configure(consumer) {
        consumer
            .apply(protect_midleware_1.ProtectMiddleware)
            .forRoutes(this.options.swaggerPath || _1.ENTRY_POINT_PROTECT);
    }
    static forRoot(options) {
        return {
            module: SwaggerProtect_1,
            imports: [SwaggerProtectCore.forRoot(options)],
        };
    }
    onModuleInit() {
        const { httpAdapter } = this.httpAdapterHost;
        this.loader.register(httpAdapter, this.ngOptions);
    }
};
SwaggerProtect = SwaggerProtect_1 = __decorate([
    common_1.Module({
        providers: [
            {
                provide: _1.SWAGGER_PROTECT_OPTIONS,
                useValue: {
                    cookieKey: _1.SWAGGER_COOKIE_TOKEN_KEY,
                    loginPath: _1.REDIRECT_TO_LOGIN,
                    swaggerPath: _1.ENTRY_POINT_PROTECT,
                    guard: (token) => !!token,
                    useUI: true,
                },
            },
            {
                provide: serve_static_1.SERVE_STATIC_MODULE_OPTIONS,
                useValue: {
                    rootPath: path_1.join(__dirname, '..', 'ui/dist'),
                },
            },
            ...serve_static_1.serveStaticProviders,
        ],
    }),
    __param(0, common_1.Inject(serve_static_1.SERVE_STATIC_MODULE_OPTIONS)),
    __param(1, common_1.Inject(_1.SWAGGER_PROTECT_OPTIONS)),
    __metadata("design:paramtypes", [Array, Object, serve_static_1.AbstractLoader,
        core_1.HttpAdapterHost])
], SwaggerProtect);
exports.SwaggerProtect = SwaggerProtect;
