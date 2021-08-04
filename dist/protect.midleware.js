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
exports.ProtectMiddleware = void 0;
const common_1 = require("@nestjs/common");
const _1 = require(".");
let ProtectMiddleware = class ProtectMiddleware {
    options;
    constructor(options) {
        this.options = options;
    }
    async use(req, res, next) {
        const token = req.cookies[this.options.cookieKey || _1.SWAGGER_COOKIE_TOKEN_KEY];
        if (token) {
            if (await this.options.guard(token))
                next();
        }
        res.status(common_1.HttpStatus.FOUND).redirect(this.options.loginPath || _1.REDIRECT_TO_LOGIN);
    }
};
ProtectMiddleware = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(_1.SWAGGER_PROTECT_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], ProtectMiddleware);
exports.ProtectMiddleware = ProtectMiddleware;
