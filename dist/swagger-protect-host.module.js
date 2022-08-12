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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerProtectHost = void 0;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const _1 = require(".");
const fastify_init_1 = require("./fastify.init");
const isClass = (ob) => /^\s*?class/.test(ob.toString());
let SwaggerProtectHost = class SwaggerProtectHost {
    adapterHost;
    options;
    guard;
    constructor(adapterHost, options, guard) {
        this.adapterHost = adapterHost;
        this.options = options;
        this.guard = guard;
    }
    onModuleInit() {
        const { httpAdapter } = this.adapterHost;
        if (httpAdapter.getType() === 'fastify') {
            (0, fastify_init_1.fastifyOnModuleInit)(httpAdapter.getInstance(), this.options, this.guard);
        }
    }
    static createProvider(ob, symbol, asClass) {
        if (typeof ob === 'function') {
            if (isClass(ob)) {
                return {
                    provide: symbol,
                    useClass: ob,
                };
            }
            else {
                return {
                    provide: symbol,
                    useClass: asClass,
                };
            }
        }
        return {
            provide: symbol,
            useValue: ob || undefined,
        };
    }
    static provideUI(useUI, loginPath) {
        switch (typeof useUI) {
            case 'undefined': {
                if (typeof loginPath === 'string') {
                    return loginPath === _1.REDIRECT_TO_LOGIN;
                }
                return true;
            }
            case 'boolean': {
                if (typeof loginPath === 'string') {
                    return useUI && loginPath === _1.REDIRECT_TO_LOGIN;
                }
                return useUI;
            }
        }
    }
};
SwaggerProtectHost = __decorate([
    (0, common_1.Module)({}),
    __param(1, (0, common_1.Inject)(_1.SWAGGER_PROTECT_OPTIONS)),
    __param(2, (0, common_1.Inject)(_1.SWAGGER_GUARD)),
    __metadata("design:paramtypes", [core_1.HttpAdapterHost, Object, Object])
], SwaggerProtectHost);
exports.SwaggerProtectHost = SwaggerProtectHost;
