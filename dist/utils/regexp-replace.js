"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceApi = void 0;
const constatnt_1 = require("../constatnt");
function replaceApi(path) {
    const template = String(constatnt_1.ENTRY_POINT_PROTECT);
    const regText = template.replace(constatnt_1.SWAGGER_DEFAULT_PATH, String(path));
    return new RegExp(regText.replace(/^\/(.*)\/$/, '$1'));
}
exports.replaceApi = replaceApi;
exports.default = replaceApi;
