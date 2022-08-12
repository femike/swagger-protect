"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerProtectHostAsyncModule = void 0;
const core_1 = require("@nestjs/core");
const serve_static_1 = require("@nestjs/serve-static");
const node_path_1 = require("node:path");
const swagger_protect_host_module_1 = require("./swagger-protect-host.module");
const swagger_protect_controller_1 = require("./swagger-protect.controller");
const _1 = require(".");
const UI_PATH = (0, node_path_1.join)(__dirname, '../..', 'swagger-protect-ui/dist');
class SwaggerProtectHostAsyncModule extends swagger_protect_host_module_1.SwaggerProtectHost {
    static async forRootAsync(options) {
        const $options = await this.createAsyncOptionsProvider(options);
        const imports = options.imports || [];
        const providers = [core_1.HttpAdapterHost];
        const controllers = [];
        const exports = [...providers];
        if ('useFactory' in $options) {
            const { useUI, loginPath, guard, logIn } = await $options.useFactory();
            providers.push(super.createProvider(guard, _1.SWAGGER_GUARD, class SwaggerGuard {
                canActivate;
                constructor(canActivate = guard) {
                    this.canActivate = canActivate;
                }
            }));
            providers.push(super.createProvider(logIn, _1.SWAGGER_LOGIN, class SwaggerLogin {
                execute;
                constructor(execute = logIn) {
                    this.execute = execute;
                }
            }));
            imports.push(...(this.provideUI(useUI, loginPath)
                ? [
                    serve_static_1.ServeStaticModule.forRootAsync({
                        extraProviders: [core_1.HttpAdapterHost],
                        useFactory: () => [
                            {
                                rootPath: UI_PATH,
                                renderPath: _1.REDIRECT_TO_LOGIN + '/*',
                                serveRoot: _1.REDIRECT_TO_LOGIN,
                            },
                        ],
                    }),
                ]
                : []));
            controllers.push(...(this.provideUI(useUI, loginPath) ? [swagger_protect_controller_1.SwaggerProtectController] : []));
        }
        return {
            global: true,
            module: swagger_protect_host_module_1.SwaggerProtectHost,
            imports,
            providers,
            controllers,
            exports,
        };
    }
    static async createAsyncOptionsProvider(options) {
        if ('useFactory' in options && typeof options.useFactory === 'function') {
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
}
exports.SwaggerProtectHostAsyncModule = SwaggerProtectHostAsyncModule;
