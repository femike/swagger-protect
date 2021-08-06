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
const swagger_1 = require("@nestjs/swagger");
const _1 = require(".");
const login_dto_1 = require("./dto/login.dto");
let SwaggerProtectController = class SwaggerProtectController {
    options;
    logIn;
    constructor(options, logIn) {
        this.options = options;
        this.logIn = logIn;
    }
    entry(res, backUrl) {
        return res
            .status(common_1.HttpStatus.FOUND)
            .redirect(`${this.options.loginPath || _1.REDIRECT_TO_LOGIN}/index.html?backUrl=${backUrl || this.options.swaggerPath || _1.ENTRY_POINT_PROTECT}`);
    }
    post(data) {
        if (typeof this.options.logIn !== 'undefined') {
            if (typeof this.options.logIn === 'function') {
                if (typeof this.options.logIn.prototype.execute !== 'undefined' &&
                    this.logIn) {
                    return this.logIn.execute(data);
                }
                else {
                    return this.options.logIn(data);
                }
            }
        }
        else {
            throw new common_1.BadRequestException('logIn not implement in module swagger-protect, contact with system administrator resolve this problem.');
        }
    }
};
__decorate([
    common_1.Get(),
    __param(0, common_1.Res()),
    __param(1, common_1.Query('backUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SwaggerProtectController.prototype, "entry", null);
__decorate([
    common_1.Post(),
    common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.SwaggerProtectLogInDto]),
    __metadata("design:returntype", Object)
], SwaggerProtectController.prototype, "post", null);
SwaggerProtectController = __decorate([
    swagger_1.ApiTags('swagger-protect'),
    common_1.Controller('login-api'),
    __param(0, common_1.Inject(_1.SWAGGER_PROTECT_OPTIONS)),
    __param(1, common_1.Inject(_1.SWAGGER_LOGIN)),
    __metadata("design:paramtypes", [Object, Object])
], SwaggerProtectController);
exports.SwaggerProtectController = SwaggerProtectController;
