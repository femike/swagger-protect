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
exports.SwaggerProtectController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const _1 = require(".");
const login_dto_1 = require("./dto/login.dto");
let SwaggerProtectController = class SwaggerProtectController {
    options;
    constructor(options) {
        this.options = options;
    }
    entry() {
    }
    async post(data) {
        if (this.options.logIn) {
            return await this.options.logIn(data);
        }
        else {
            throw new Error('logIn not implement in module swagger-protect');
        }
    }
};
__decorate([
    common_2.Get(),
    common_2.Redirect('/login-api/index.html'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SwaggerProtectController.prototype, "entry", null);
__decorate([
    common_2.Post(),
    common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
    __param(0, common_2.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.SwaggerProtectLogInDto]),
    __metadata("design:returntype", Promise)
], SwaggerProtectController.prototype, "post", null);
SwaggerProtectController = __decorate([
    swagger_1.ApiTags('swagger-protect'),
    common_2.Controller('login-api'),
    __param(0, common_2.Inject(_1.SWAGGER_PROTECT_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], SwaggerProtectController);
exports.SwaggerProtectController = SwaggerProtectController;
