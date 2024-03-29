"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SWAGGER_PROTECT_OPTIONS = exports.SWAGGER_LOGIN = exports.SWAGGER_GUARD = exports.SWAGGER_DEFAULT_PATH = exports.ENTRY_POINT_PROTECT = exports.REDIRECT_TO_LOGIN = exports.SWAGGER_COOKIE_TOKEN_KEY = void 0;
exports.SWAGGER_COOKIE_TOKEN_KEY = 'swagger_token';
exports.REDIRECT_TO_LOGIN = '/login-api';
exports.ENTRY_POINT_PROTECT = /^\/api(?:\/|-json|\/json|\/static.+|\/swagger.+)?$/;
exports.SWAGGER_DEFAULT_PATH = 'api';
exports.SWAGGER_GUARD = 'SWAGGER_GUARD';
exports.SWAGGER_LOGIN = 'SWAGGER_LOGIN';
exports.SWAGGER_PROTECT_OPTIONS = 'SWAGGER_PROTECT_OPTIONS';
