"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerProtectHostModule = void 0;
const serve_static_1 = require("@nestjs/serve-static");
const node_path_1 = require("node:path");
const _1 = require(".");
const swagger_protect_host_module_1 = require("./swagger-protect-host.module");
const swagger_protect_controller_1 = require("./swagger-protect.controller");
const core_1 = require("@nestjs/core");
const UI_PATH = (0, node_path_1.join)(__dirname, '../..', 'swagger-protect-ui/dist');
class SwaggerProtectHostModule extends swagger_protect_host_module_1.SwaggerProtectHost {
    static forRoot(options) {
        const moduleOptionsProvider = {
            provide: _1.SWAGGER_PROTECT_OPTIONS,
            useValue: {
                cookieKey: _1.SWAGGER_COOKIE_TOKEN_KEY,
                loginPath: _1.REDIRECT_TO_LOGIN,
                swaggerPath: _1.ENTRY_POINT_PROTECT,
                useUI: true,
                ...options,
            },
        };
        if (options.loginPath?.includes('*')) {
            throw new Error('`loginPath` must not contain (*) wildcards.');
        }
        const swagLoginProvider = super.createProvider(options.logIn, _1.SWAGGER_LOGIN, class SwaggerLogin {
            execute;
            constructor(execute = options.logIn) {
                this.execute = execute;
            }
        });
        const swagGuardProvider = {
            provide: _1.SWAGGER_GUARD,
            useValue: options.guard || false,
        };
        return {
            global: true,
            module: swagger_protect_host_module_1.SwaggerProtectHost,
            imports: moduleOptionsProvider.useValue.useUI &&
                moduleOptionsProvider.useValue.loginPath === _1.REDIRECT_TO_LOGIN
                ? [
                    serve_static_1.ServeStaticModule.forRootAsync({
                        inject: [core_1.HttpAdapterHost],
                        useFactory: async () => [
                            {
                                rootPath: UI_PATH,
                                renderPath: _1.REDIRECT_TO_LOGIN + '/*',
                                serveRoot: _1.REDIRECT_TO_LOGIN,
                            },
                        ],
                    }),
                ]
                : [],
            providers: [moduleOptionsProvider, swagGuardProvider, swagLoginProvider],
            exports: [moduleOptionsProvider, swagGuardProvider, swagLoginProvider],
            controllers: moduleOptionsProvider.useValue.useUI &&
                moduleOptionsProvider.useValue.loginPath === _1.REDIRECT_TO_LOGIN
                ? [swagger_protect_controller_1.SwaggerProtectController]
                : [],
        };
    }
}
exports.SwaggerProtectHostModule = SwaggerProtectHostModule;
