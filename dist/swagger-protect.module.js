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
var SwaggerProtectCore_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerProtect = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const serve_static_1 = require("@nestjs/serve-static");
const cookieParser = require("cookie-parser");
const path_1 = require("path");
const _1 = require(".");
const swagger_protect_controller_1 = require("./swagger-protect.controller");
const UI_PATH = path_1.join(__dirname, '../..', 'swagger-protect-ui/dist');
const isClass = (ob) => /^\s*?class/.test(ob.toString());
let SwaggerProtectCore = SwaggerProtectCore_1 = class SwaggerProtectCore {
    httpAdapterHost;
    options;
    guard;
    constructor(httpAdapterHost, options, guard) {
        this.httpAdapterHost = httpAdapterHost;
        this.options = options;
        this.guard = guard;
    }
    onModuleInit() {
        const { httpAdapter } = this.httpAdapterHost;
        const server = httpAdapter.getInstance();
        if (Object.keys(server).includes('addHook')) {
            const { logIn, useUI, ...protect } = this.options;
            server.addHook('onRequest', _1.fastifyProtectSwagger({
                ...protect,
                guard: this.guard || protect.guard,
            }));
        }
        else {
            const { logIn, useUI, ...protect } = this.options;
            server.use(cookieParser());
            server.use(_1.expressProtectSwagger({
                ...protect,
                guard: this.guard || protect.guard,
            }));
        }
    }
    static forRoot(options) {
        const moduleOptions = {
            provide: _1.SWAGGER_PROTECT_OPTIONS,
            useValue: {
                cookieKey: _1.SWAGGER_COOKIE_TOKEN_KEY,
                loginPath: _1.REDIRECT_TO_LOGIN,
                swaggerPath: _1.ENTRY_POINT_PROTECT,
                useUI: true,
                ...options,
            },
        };
        if (options.loginPath?.includes('*'))
            throw new Error('`loginPath` must not contain (*) wildcards.');
        const swaggerLoginProvide = typeof options.logIn === 'function'
            ? {
                provide: _1.SWAGGER_LOGIN,
                useClass: class SwaggerLogin {
                    execute;
                    constructor(execute = options.logIn) {
                        this.execute = execute;
                    }
                },
                inject: [_1.SWAGGER_LOGIN],
            }
            : {
                provide: _1.SWAGGER_LOGIN,
                useValue: options.logIn,
                inject: [_1.SWAGGER_LOGIN],
            };
        return {
            module: SwaggerProtectCore_1,
            imports: moduleOptions.useValue.useUI &&
                moduleOptions.useValue.loginPath === _1.REDIRECT_TO_LOGIN
                ? [
                    serve_static_1.ServeStaticModule.forRoot({
                        rootPath: UI_PATH,
                        renderPath: _1.REDIRECT_TO_LOGIN + '/*',
                        serveRoot: _1.REDIRECT_TO_LOGIN,
                    }),
                ]
                : [],
            providers: [
                moduleOptions,
                {
                    provide: _1.SWAGGER_GUARD,
                    useValue: options.guard,
                    inject: [_1.SWAGGER_GUARD],
                },
                swaggerLoginProvide,
            ],
            exports: [moduleOptions],
            controllers: moduleOptions.useValue.useUI &&
                moduleOptions.useValue.loginPath === _1.REDIRECT_TO_LOGIN
                ? [swagger_protect_controller_1.SwaggerProtectController]
                : [],
        };
    }
    static provideUI(useUI, loginPath) {
        if (typeof useUI === 'undefined' && typeof loginPath === 'undefined') {
            return true;
        }
        else if (typeof useUI === 'undefined' &&
            typeof loginPath !== 'undefined') {
            return loginPath === _1.REDIRECT_TO_LOGIN;
        }
        else if (typeof useUI !== 'undefined' &&
            typeof loginPath === 'undefined') {
            return useUI;
        }
        else {
            return useUI && loginPath === _1.REDIRECT_TO_LOGIN;
        }
    }
    static async forRootAsync(options) {
        const $options = (await this.createAsyncOptionsProvider(options));
        const asyncProviders = await this.createAsyncProviders(options);
        const module = {
            module: SwaggerProtectCore_1,
            imports: options.imports,
            providers: [...asyncProviders],
        };
        if (typeof options.useFactory !== 'undefined') {
            const { useUI, loginPath, guard, logIn } = $options.useFactory();
            module.providers.push(this.createProvider(guard, _1.SWAGGER_GUARD, class SwaggerGuard {
                canActivate;
                constructor(canActivate = guard) {
                    this.canActivate = canActivate;
                }
            }));
            module.providers.push(this.createProvider(logIn, _1.SWAGGER_LOGIN, class SwaggerLogin {
                execute;
                constructor(execute = logIn) {
                    this.execute = execute;
                }
            }));
            const importStatic = this.provideUI(useUI, loginPath)
                ? [
                    serve_static_1.ServeStaticModule.forRoot({
                        rootPath: UI_PATH,
                        renderPath: _1.REDIRECT_TO_LOGIN + '/*',
                        serveRoot: _1.REDIRECT_TO_LOGIN,
                    }),
                ]
                : [];
            return {
                ...module,
                imports: [...(module.imports || []), ...importStatic],
                controllers: this.provideUI(useUI, loginPath)
                    ? [swagger_protect_controller_1.SwaggerProtectController]
                    : [],
            };
        }
        return module;
    }
    static createProvider(ob, symbol, asClass) {
        if (typeof ob === 'function') {
            if (isClass(ob)) {
                return {
                    provide: symbol,
                    useClass: ob,
                    inject: [symbol],
                };
            }
            else {
                return {
                    provide: symbol,
                    useClass: asClass,
                    inject: [symbol],
                };
            }
        }
        else if (typeof ob === 'object') {
            return {
                provide: symbol,
                useValue: ob,
                inject: [symbol],
            };
        }
        return {};
    }
    static async createAsyncProviders(options) {
        if (options.useFactory) {
            return [await this.createAsyncOptionsProvider(options)];
        }
        return [];
    }
    static async createAsyncOptionsProvider(options) {
        if (typeof options.useFactory !== 'undefined') {
            return {
                provide: _1.SWAGGER_PROTECT_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }
        return {
            provide: _1.SWAGGER_PROTECT_OPTIONS,
            useValue: undefined,
        };
    }
};
SwaggerProtectCore = SwaggerProtectCore_1 = __decorate([
    common_1.Global(),
    common_1.Module({}),
    __param(1, common_1.Inject(_1.SWAGGER_PROTECT_OPTIONS)),
    __param(2, common_1.Inject(_1.SWAGGER_GUARD)),
    __metadata("design:paramtypes", [core_1.HttpAdapterHost, Object, Object])
], SwaggerProtectCore);
let SwaggerProtect = class SwaggerProtect extends SwaggerProtectCore {
    static forRoot(options) {
        return super.forRoot(options);
    }
    static async forRootAsync(options) {
        return await super.forRootAsync(options);
    }
};
SwaggerProtect = __decorate([
    common_1.Module({
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
