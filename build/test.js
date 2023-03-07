"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var playwright_1 = __importDefault(require("playwright"));
var fs_1 = require("fs");
var path_1 = require("path");
var fs_extra_1 = __importDefault(require("fs-extra"));
var hasha_1 = __importDefault(require("hasha"));
var child_process_1 = require("child_process"); // import devices
var chromium = playwright_1.default.chromium, firefox = playwright_1.default.firefox, devices = playwright_1.default.devices, webkit = playwright_1.default.webkit;
var os = require("os");
var iPhone = devices["iPhone 13 Pro"];
// check the available memory
var userHomeDir = os.homedir();
var preloadFile = fs_1.readFileSync(path_1.join(__dirname, './small_injector.js'), 'utf8');
var argv = require('yargs')
    .option('url', {
    alias: 'u',
    type: 'string',
    description: 'URL to scan',
})
    .option('file', {
    alias: 'f',
    type: 'string',
    description: 'File path of text file (CSV) containing list of websites to scan',
})
    .option('full', {
    alias: 'l',
    type: 'boolean',
    default: false,
    description: 'Set true to download all of the files on a web page when visited with the crawler',
})
    .argv;
var PROD = process.env.NODE_ENV === 'production' ? true : false;
var URL_TO_SCAN = process.env.URL_TO_SCAN;
var browserLaunchers = [firefox, chromium];
function initSetting(page) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.addInitScript(preloadFile)];
                case 1:
                    _a.sent();
                    page.exposeFunction('transferWasm', function (stringBuffer) { return __awaiter(_this, void 0, void 0, function () {
                        var str2ab, wasmBuffer, bufferHashString, child;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    str2ab = function _str2ab(str) {
                                        var buf = new ArrayBuffer(str.length); // 1 byte for each char
                                        var bufView = new Uint8Array(buf);
                                        for (var i = 0, strLen = str.length; i < strLen; i++) {
                                            bufView[i] = str.charCodeAt(i);
                                        }
                                        return Buffer.from(buf);
                                    };
                                    wasmBuffer = str2ab(stringBuffer);
                                    return [4 /*yield*/, hasha_1.default.async(wasmBuffer, { algorithm: 'sha256' })];
                                case 1:
                                    bufferHashString = _a.sent();
                                    return [4 /*yield*/, fs_extra_1.default.outputFile(path_1.resolve('./transformed/', bufferHashString + ".wasm"), wasmBuffer)];
                                case 2:
                                    _a.sent();
                                    child = child_process_1.exec("wasm2wat ./transformed/" + bufferHashString + ".wasm -o ./transformed/" + bufferHashString + ".wat");
                                    child.on('exit', function () {
                                        var filecontent = fs_extra_1.default.readFileSync("./transformed/" + bufferHashString + ".wat", 'utf-8');
                                        filecontent.split(/\r?\n/).forEach(function (line) {
                                            console.log("Line from file: " + line);
                                        });
                                        child_process_1.exec("wasm2wat ./transformed/" + bufferHashString + ".wat -o ./transformed/" + bufferHashString + ".wasm").on('exit', function () {
                                            return fs_extra_1.default.readFileSync("./transformed/" + bufferHashString + ".wasm");
                                        });
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var urlToScan, browserLaunchers_1, browserLaunchers_1_1, launcher, browser_1, page, e_1_1;
        var e_1, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(argv.url != null || URL_TO_SCAN != null)) return [3 /*break*/, 9];
                    urlToScan = (_a = URL_TO_SCAN !== null && URL_TO_SCAN !== void 0 ? URL_TO_SCAN : argv.url) !== null && _a !== void 0 ? _a : '';
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 7, 8, 9]);
                    browserLaunchers_1 = __values(browserLaunchers), browserLaunchers_1_1 = browserLaunchers_1.next();
                    _c.label = 2;
                case 2:
                    if (!!browserLaunchers_1_1.done) return [3 /*break*/, 6];
                    launcher = browserLaunchers_1_1.value;
                    if (!(urlToScan !== '')) return [3 /*break*/, 5];
                    return [4 /*yield*/, firefox.launchPersistentContext(userHomeDir, {
                            deviceScaleFactor: iPhone.deviceScaleFactor,
                            isMobile: iPhone.isMobile,
                            viewport: iPhone.viewport,
                            userAgent: iPhone.userAgent,
                            headless: false
                            //viewport: { width: 1280, height: 720 }
                        })];
                case 3:
                    browser_1 = _c.sent();
                    return [4 /*yield*/, browser_1.newPage()];
                case 4:
                    page = _c.sent();
                    page.goto(urlToScan);
                    _c.label = 5;
                case 5:
                    browserLaunchers_1_1 = browserLaunchers_1.next();
                    return [3 /*break*/, 2];
                case 6: return [3 /*break*/, 9];
                case 7:
                    e_1_1 = _c.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 9];
                case 8:
                    try {
                        if (browserLaunchers_1_1 && !browserLaunchers_1_1.done && (_b = browserLaunchers_1.return)) _b.call(browserLaunchers_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
main();
//# sourceMappingURL=test.js.map